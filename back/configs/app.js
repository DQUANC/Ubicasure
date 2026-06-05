'use strict'

const path = require('path');
const userRoutes = require('../src/routes/user.routes');
const stationRoutes = require('../src/routes/station.routes');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 3200;

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://propuestaestaciones.web.app',
    'https://propuestaestaciones.firebaseapp.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/user/login', loginLimiter);
app.use('/user', userRoutes);
app.use('/station', stationRoutes);

// Serve Angular SPA only when the build output exists locally (not on Render where only back/ is deployed)
const fs = require('fs');
const distPath = path.join(__dirname, '../../front/dist/map');
if (fs.existsSync(path.join(distPath, 'index.html'))) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

exports.initServer = () => app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
