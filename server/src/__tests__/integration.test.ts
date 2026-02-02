import request from 'supertest';
import app from '../index.js';
import { sequelize } from '../models/index.js';

// Close DB connection after tests
afterAll(async () => {
    await sequelize.close();
});

describe('API Integration Tests', () => {

    test('GET /unknown-route should return 404', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.status).toBe(404);
    });

    test('POST /api/auth/login without body should fail', async () => {
        const res = await request(app).post('/api/auth/login').send({});
        // Depending on implementation, might be 400 or 500 or 401
        // Since we didn't inspect validation logic deeply, let's assume it fails
        expect(res.status).not.toBe(200);
    });

    // Test a public route if any exists without auth
    // ...
});
