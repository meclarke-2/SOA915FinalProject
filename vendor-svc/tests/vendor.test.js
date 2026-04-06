const request = require('supertest');
const app = require('../server');

describe('Vendor API - Unit Tests', () => {

  it('GET /api/vendors should return 200', async () => {
    const res = await request(app).get('/api/vendors');
    expect(res.statusCode).toBe(200);
  });

  it('POST /api/vendors should fail without name/email', async () => {
    const res = await request(app).post('/api/vendors').send({});
    expect(res.statusCode).toBe(400);
  });

});