const request = require('supertest');

const vendorURL = 'http://localhost:3001';
const productURL = 'http://localhost:3002';

describe('End-to-End Test', () => {

  it('should create vendor and product successfully', async () => {

    const vendor = await request(vendorURL)
      .post('/api/vendors')
      .send({
        name: "Test Vendor",
        email: "test@test.com"
      });

    const product = await request(productURL)
      .post('/api/products')
      .send({
        name: "Test Product",
        price: 50,
        category: "test",
        vendorId: vendor.body._id
      });

    expect(product.statusCode).toBe(201);
  });

});