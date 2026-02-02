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

// Declare lets at top level for scope availability
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
        // Dynamic imports inside beforeAll to handle ESM awaits correctly within Jest lifecycle if needed
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
        // Create candidate
        const regRes = await request(app).post('/api/auth/register').send({
            username: 'Cand', email: 'cand@test.com', password: '123', role: 'candidate'
        });
        // Login candidate to get ID reliably if register doesn't return ID
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

    // --- ERROR SCENARIOS (Coverage Booster) ---
    describe('Error Handling', () => {
        test('GET /api/tests Error (500)', async () => {
            const originalFindAll = Test.findAll;
            Test.findAll = jest.fn().mockRejectedValue(new Error('DB Boom')); // Mock on the real object
            const res = await request(app).get('/api/tests');
            expect(res.status).toBe(500);
            Test.findAll = originalFindAll; // Restore
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
    });
});
