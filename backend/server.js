const express = require('express');
const connectDB = require('./db');
const healthRouter = require('./routes/healthRoutes');

const app = express();

app.use('/api', healthRouter);

app.listen(3000, () => {
  console.log('Kustomize API listening on http://localhost:3000');
});

const uri = process.env.MONGODB_URI;

if (uri) {
  connectDB(uri).catch(() => {
    console.error('MongoDB connection failed. Check MONGODB_URI and database availability.');
  });
}
