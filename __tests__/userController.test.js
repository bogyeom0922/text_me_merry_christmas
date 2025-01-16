const request = require('supertest');
const app = require('../app');
const db = require('../src/services/dbService');
const {v4: uuidv4} = require('uuid');

describe('POST /user/signup', () => {
    it('should create a new user and redirect to login', async () => {
        const uniqueId = uuidv4();
        const userData = {
            id: uniqueId,
            password: 'testpassword',
            name: 'testname',
            introduction: 'Hello, I am a test user!',
            profileImage: null,
        };
        console.log('Sending user data:', userData);

        const response = await request(app)
            .post('/user/signup')
            .type('form')
            .send(userData);
        console.log('Response status:', response.status);

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/user/login');
    });

    it('should fail when required fields are missing', async () => {
        const userData = {
            id: '',
            password: 'testpassword2',
            name: 'testname2',
            introduction: 'Hello',
            profileImage: null,
        };

        const response = await request(app)
            .post('/user/signup')
            .type('form')
            .send(userData);

        expect(response.status).toBe(400);
    });
});

afterAll(async () => {
    await db.close();
});