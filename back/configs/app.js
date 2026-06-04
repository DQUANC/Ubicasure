'use strict'

const userRoutes = require('../src/routes/user.routes');
const stationRoutes = require('../src/routes/station.routes');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3200;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/user', userRoutes);
app.use('/station', stationRoutes);

exports.initServer = ()=> app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});