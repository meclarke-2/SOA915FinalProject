const request = require('supertest');
const app = require('../server');

describe('Integration Test - Product & Vendor', () => {

  it('should fail if vendor does not exist', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: "Test Product",
        price: 100,
        category: "test",
        vendorId: "invalid123"
      });

    expect(res.statusCode).toBe(404);
  });

});