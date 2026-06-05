'use strict'

require('dotenv').config();

const mongoConfigs = require('./configs/mongoConfigs');
const app = require('./configs/app');
const userController = require('./src/controllers/user.controller');

async function start() {
    await mongoConfigs.init();
    app.initServer();
    await userController.createAdmin();
}

start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});