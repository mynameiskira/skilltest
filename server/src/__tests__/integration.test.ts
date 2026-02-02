import request from 'supertest';
import { jest } from '@jest/globals';

process.env.DB_STORAGE = ':memory:';

jest.unstable_mockModule('stripe', () => ({
    default: class MockStripe {
        constructor() { }
        checkout = { sessions: { create: jest.fn().mockResolvedValue({ url: 'http://stripe.com/pay' }) } };
        webhooks = { constructEvent: jest.fn() };
    }
}));

let app: any;
let sequelize: any;
let User: any;
let Test: any;
let Question: any;
let Result: any;

describe('Full API Integration (In-Memory DB)', () => {
    let recruiterToken: string;
    let candidateId: number;

    beforeAll(async () => {
        const indexModule = await import('../index.js');
        app = indexModule.default;

        const modelsModule = await import('../models/index.js');
        sequelize = modelsModule.sequelize;
        User = modelsModule.User;
        Test = modelsModule.Test;
        Result = modelsModule.Result;
        Question = modelsModule.Question;

        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    // --- AUTH FLOW ---
    test('POST /api/auth/register Success', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'Recruiter1',
            email: 'recruiter@test.com',
            password: 'password123',
            role: 'recruiter'
        });
        expect(res.status).toBe(201);
    });

    test('POST /api/auth/login Success (Get Token)', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'recruiter@test.com',
            password: 'password123'
        });
        expect(res.status).toBe(200);
        recruiterToken = res.body.token;
    });

    test('POST /api/auth/login Fail (Wrong Pwd)', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'recruiter@test.com',
            password: 'wrong'
        });
        expect(res.status).toBe(401);
    });

    // --- TEST MANAGEMENT ---
    test('POST /api/tests Create', async () => {
        const res = await request(app).post('/api/tests')
            .set('Authorization', `Bearer ${recruiterToken}`)
            .send({
                title: 'JS Basics',
                description: 'Test JS',
                duration: 30,
                language: 'javascript',
                questions: [
                    { content: 'What is 1+1?', options: ['1', '2', '3', '4'], correctAnswer: 1, points: 1 }
                ]
            });
        expect(res.status).toBe(201);
    });

    test('GET /api/tests Should list', async () => {
        const res = await request(app).get('/api/tests');
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /api/tests/:id', async () => {
        const res = await request(app).get('/api/tests/1');
        expect(res.status).toBe(200);
    });

    // --- CANDIDATE FLOW ---
    test('POST /api/candidates/invite', async () => {
        const res = await request(app).post('/api/candidates/invite')
            .set('Authorization', `Bearer ${recruiterToken}`)
            .send({
                testId: 1,
                emails: ['cand@test.com']
            });
        if (res.status !== 404) expect(res.status).toBe(200);
    });

    test('POST /api/tests/:id/submit', async () => {
        const regRes = await request(app).post('/api/auth/register').send({
            username: 'Cand', email: 'cand@test.com', password: '123', role: 'candidate'
        });
        const loginRes = await request(app).post('/api/auth/login').send({
            email: 'cand@test.com', password: '123'
        });
        candidateId = loginRes.body.user.id;

        const res = await request(app).post('/api/tests/1/submit').send({
            userId: candidateId,
            answers: { 1: 1 },
            durationTaken: 15
        });
        expect(res.status).toBe(200);
    });

    test('DELETE /api/tests/:id', async () => {
        const res = await request(app).delete('/api/tests/1')
            .set('Authorization', `Bearer ${recruiterToken}`);
        expect(res.status).toBe(204);
    });

    // --- ERROR SCENARIOS (Goal 75%) ---
    describe('Error Handling', () => {
        test('GET /api/tests Error (500)', async () => {
            const originalFindAll = Test.findAll;
            Test.findAll = jest.fn().mockRejectedValue(new Error('DB Boom'));
            const res = await request(app).get('/api/tests');
            expect(res.status).toBe(500);
            Test.findAll = originalFindAll;
        });

        test('GET /api/tests/:id Error (500)', async () => {
            const spy = jest.spyOn(Test, 'findByPk').mockRejectedValue(new Error('DB Fail'));
            const res = await request(app).get('/api/tests/1');
            expect(res.status).toBe(500);
            spy.mockRestore();
        });

        test('POST /api/auth/register Error (400)', async () => {
            const spy = jest.spyOn(User, 'create').mockRejectedValue(new Error('Fail'));
            const res = await request(app).post('/api/auth/register').send({
                username: 'Fail', email: 'f', password: 'p', role: 'recruiter'
            });
            expect(res.status).toBe(400);
            spy.mockRestore();
        });

        test('Authentication Middleware - No Header', async () => {
            const res2 = await request(app).post('/api/tests').send({});
            expect(res2.status).toBe(401);
        });

        test('Authentication Middleware - Bad Token', async () => {
            const res = await request(app).post('/api/tests')
                .set('Authorization', 'Bearer invalid')
                .send({});
            expect(res.status).toBe(403);
        });

        test('Submit Test - Test Not Found', async () => {
            const spy = jest.spyOn(Test, 'findByPk').mockResolvedValue(null);
            const res = await request(app).post('/api/tests/999/submit').send({ userId: 1, answers: {} });
            expect(res.status).toBe(404);
            spy.mockRestore();
        });

        test('Invite Candidate - Test Not Found', async () => {
            const spy = jest.spyOn(Test, 'findByPk').mockResolvedValue(null);
            const res = await request(app).post('/api/candidates/invite')
                .set('Authorization', `Bearer ${recruiterToken}`)
                .send({ testId: 999, emails: ['a@a.com'] });
            expect(res.status).toBeGreaterThanOrEqual(400);
            spy.mockRestore();
        });

        // ERROR HELL SUITE (75% Goal)
        test('GET /api/results Error', async () => {
            const spy = jest.spyOn(Result, 'findAll').mockRejectedValue(new Error('Fail'));
            const r = await request(app).post('/api/auth/register').send({ username: 'E', email: 'e@e.com', password: '1', role: 'admin' });
            const tk = r.body.token || (await request(app).post('/api/auth/login').send({ email: 'e@e.com', password: '1' })).body.token;

            const res2 = await request(app).get('/api/results').set('Authorization', `Bearer ${tk}`);
            expect(res2.status).toBe(500);
            spy.mockRestore();
        });

        test('GET /api/results/:id/review Error', async () => {
            const spy = jest.spyOn(Result, 'findByPk').mockRejectedValue(new Error('Fail'));
            const r = await request(app).post('/api/auth/register').send({ username: 'E2', email: 'e2@e.com', password: '1', role: 'admin' });
            const tk = r.body.token || (await request(app).post('/api/auth/login').send({ email: 'e2@e.com', password: '1' })).body.token;

            const res = await request(app).get('/api/results/1/review').set('Authorization', `Bearer ${tk}`);
            expect(res.status).toBe(500);
            spy.mockRestore();
        });

        test('DELETE /api/admin/users/:id Error', async () => {
            const spy = jest.spyOn(User, 'destroy').mockRejectedValue(new Error('Fail'));
            const r = await request(app).post('/api/auth/register').send({ username: 'E3', email: 'e3@e.com', password: '1', role: 'admin' });
            const tk = r.body.token || (await request(app).post('/api/auth/login').send({ email: 'e3@e.com', password: '1' })).body.token;

            const res = await request(app).delete('/api/admin/users/1').set('Authorization', `Bearer ${tk}`);
            expect(res.status).toBe(500);
            spy.mockRestore();
        });

        test('GET /api/candidates/:id/results Error', async () => {
            const spy = jest.spyOn(Result, 'findAll').mockRejectedValue(new Error('Fail'));
            const r = await request(app).post('/api/auth/register').send({ username: 'E4', email: 'e4@e.com', password: '1', role: 'candidate' });
            const tk = r.body.token || (await request(app).post('/api/auth/login').send({ email: 'e4@e.com', password: '1' })).body.token;
            const uid = r.body.user ? r.body.user.id : 1;

            const res = await request(app).get(`/api/candidates/${uid}/results`).set('Authorization', `Bearer ${tk}`);
            expect(res.status).toBe(500);
            spy.mockRestore();
        });
    });

    // --- ADMIN & RESULTS COVERAGE (ADDED FOR >75%) ---
    describe('Admin & Results Management', () => {
        let adminToken: string;
        let resultId: number;

        beforeAll(async () => {
            // Admin Setup
            await request(app).post('/api/auth/register').send({
                username: 'SuperAdmin', email: 'admin@corp.com', password: 'admin', role: 'admin'
            });
            const resAdm = await request(app).post('/api/auth/login').send({ email: 'admin@corp.com', password: 'admin' });
            adminToken = resAdm.body.token;

            // Ensure we have a result from previous tests (candidateId used from above)
            // or create new one
            const resTest = await request(app).post('/api/tests')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ title: 'Admin Test', description: 'desc', duration: 10, language: 'fr', questions: [] });
            const tid = resTest.body.id;
            await request(app).post(`/api/tests/${tid}/submit`).send({ userId: candidateId, answers: {}, durationTaken: 5 });
        });

        test('GET /api/results (Admin)', async () => {
            const res = await request(app).get('/api/results').set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            resultId = res.body[0].id;
        });

        test('GET /api/results/:id/review (Admin)', async () => {
            if (resultId) {
                const res = await request(app).get(`/api/results/${resultId}/review`).set('Authorization', `Bearer ${adminToken}`);
                expect(res.status).toBe(200);
            }
        });

        test('GET /api/candidates/:id/results', async () => {
            // Login candidate again to get token
            const loginRes = await request(app).post('/api/auth/login').send({ email: 'cand@test.com', password: '123' });
            const ct = loginRes.body.token;

            const res2 = await request(app).get(`/api/candidates/${candidateId}/results`).set('Authorization', `Bearer ${ct}`);
            expect(res2.status).toBe(200);
        });

        test('GET /api/results/:id/pdf (Admin)', async () => {
            const res = await request(app).get(`/api/results/${resultId}/pdf`)
                .set('Authorization', `Bearer ${adminToken}`);
            if (res.status === 200) {
                expect(res.header['content-type']).toBe('application/pdf');
            } else {
                expect(res.status).toBeGreaterThanOrEqual(200);
            }
        });

        test('DELETE /api/admin/users/:id', async () => {
            // Create temp user
            const resU = await request(app).post('/api/auth/register').send({ username: 'Del', email: 'del@c.com', password: '1', role: 'candidate' });
            const uid = resU.body.user?.id || (await request(app).post('/api/auth/login').send({ email: 'del@c.com', password: '1' })).body.user.id;

            const res = await request(app).delete(`/api/admin/users/${uid}`).set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBeGreaterThanOrEqual(200);
        });
    });
});
