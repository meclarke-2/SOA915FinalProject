const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  description: String,
  rating: { type: Number, min: 0, max: 5, default: 0 },
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', VendorSchema);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/vendors', async (req, res, next) => {
  try { res.json(await Vendor.find()); }
  catch (err) { next(err); }
});

app.post('/api/vendors', async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({ error: 'name and email required' });
    }
    const v = await Vendor.create(req.body);
    res.status(201).json(v);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'email already exists' });
    next(err);
  }
});

app.get('/api/vendors/:id', async (req, res, next) => {
  try {
    const v = await Vendor.findById(req.params.id);
    v ? res.json(v) : res.status(404).json({ error: 'not found' });
  }
  catch (err) { next(err); }
});

app.put('/api/vendors/:id', async (req, res, next) => {
  try {
    const v = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    v ? res.json(v) : res.status(404).json({ error: 'not found' });
  } catch (err) { next(err); }
});

app.delete('/api/vendors/:id', async (req, res, next) => {
  try {
    const v = await Vendor.findByIdAndDelete(req.params.id);
    v ? res.status(204).send() : res.status(404).json({ error: 'not found' });
  } catch (err) { next(err); }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal error' });
});

const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_URI || 'mongodb://vendor-db:27017/vendors')
  .then(() => { console.log('vendor-svc connected'); app.listen(PORT, () => console.log(`vendor-svc on ${PORT}`)); })
  .catch(err => { console.error(err); process.exit(1); });

// Export for testing
if (require.main !== module) module.exports = app;
