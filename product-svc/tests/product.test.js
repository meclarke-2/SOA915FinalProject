const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Product API - Unit Tests', () => {

  it('GET /api/products should return 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
  });

  it('POST /api/products should fail without required fields', async () => {
    const res = await request(app).post('/api/products').send({});
    expect(res.statusCode).toBe(400);
  });

});