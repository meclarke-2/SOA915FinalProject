const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

app.use(express.json());

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  vendorId: { type: String, required: true },
  stock: { type: Number, min: 0, default: 0 },
  imageUrl: String,
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

const VENDOR_URL = process.env.VENDOR_SERVICE_URL || 'http://vendor-svc:3001';

async function vendorExists(id) {
  try {
    const res = await axios.get(`${VENDOR_URL}/api/vendors/${id}`, { timeout: 3000 });
    return res.status === 200;
  } catch {
    return false;
  }
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/products', async (req, res, next) => {
  try { res.json(await Product.find()); }
  catch (err) { next(err); }
});

app.post('/api/products', async (req, res, next) => {
  try {
    if (!req.body.name || req.body.price == null || !req.body.category || !req.body.vendorId) {
      return res.status(400).json({ error: 'name, price, category, vendorId required' });
    }
    if (!await vendorExists(req.body.vendorId)) {
      return res.status(404).json({ error: 'vendor not found' });
    }
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (err) { next(err); }
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: 'not found' });
  } catch (err) { next(err); }
});

app.put('/api/products/:id', async (req, res, next) => {
  try {
    if (req.body.vendorId && !await vendorExists(req.body.vendorId)) {
      return res.status(404).json({ error: 'vendor not found' });
    }
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    p ? res.json(p) : res.status(404).json({ error: 'not found' });
  } catch (err) { next(err); }
});

app.delete('/api/products/:id', async (req, res, next) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    p ? res.status(204).send() : res.status(404).json({ error: 'not found' });
  } catch (err) { next(err); }
});

app.get('/api/products/vendor/:vendorId', async (req, res, next) => {
  try { res.json(await Product.find({ vendorId: req.params.vendorId })); }
  catch (err) { next(err); }
});

app.get('/api/products/category/:category', async (req, res, next) => {
  try { res.json(await Product.find({ category: req.params.category })); }
  catch (err) { next(err); }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal error' });
});

const PORT = process.env.PORT || 3002;
mongoose.connect(process.env.MONGO_URI || 'mongodb://product-db:27017/products')
  .then(() => { console.log('product-svc connected'); app.listen(PORT, () => console.log(`product-svc on ${PORT}`)); })
  .catch(err => { console.error(err); process.exit(1); });

// Export for testing
if (require.main !== module) module.exports = app;
