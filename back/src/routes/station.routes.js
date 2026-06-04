'use strict'

const express = require('express');
const api = express.Router();
const stationController = require('../controllers/station.controller');
const mdAuth = require('../services/authenticated');

//RUTAS ADMIN

api.post('/createStation',[mdAuth.ensureAuth, mdAuth.isAdmin], stationController.createStation);
api.put('/updateStation/:idS', [mdAuth.ensureAuth, mdAuth.isAdmin], stationController.updateStation);
api.delete('/deleteStation/:idS', [mdAuth.ensureAuth, mdAuth.isAdmin], stationController.deleteStation);

//RUTAS CLIENT
api.get('/getStations', mdAuth.ensureAuth, stationController.getStations);

api.get('/getPoliceStations', mdAuth.ensureAuth, stationController.getPoliceStations);
api.get('/getNationalStationsP', mdAuth.ensureAuth, stationController.getNationalStationsP);
api.get('/getMunicipalStationsP', mdAuth.ensureAuth, stationController.getMunicipalStationsP);

api.get('/getFireStations', mdAuth.ensureAuth, stationController.getFireStations);
api.get('/getMunicipalStationsF', mdAuth.ensureAuth, stationController.getMunicipalStationsF);
api.get('/getVolunteerStationsF', mdAuth.ensureAuth, stationController.getVolunteerStationsF);

module.exports = api;
