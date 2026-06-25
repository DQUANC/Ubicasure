'use strict'

const userRoutes = require('../src/routes/user.routes');
const stationRoutes = require('../src/routes/station.routes');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 3200;

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

// Build allowed origins: static list plus optional FRONTEND_URL env var for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200',
  'https://ubicasure-43ef4.web.app',
  'https://ubicasure-43ef4.firebaseapp.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint for Railway
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/user/login', loginLimiter);
app.use('/user', userRoutes);
app.use('/station', stationRoutes);

exports.initServer = () => app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
