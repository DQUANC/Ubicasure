'use strict'

const express = require('express');
const api = express.Router();
const stationController = require('../controllers/station.controller');
const mdAuth = require('../services/authenticated');

// Admin-only write routes (still require auth + admin role)
api.post('/createStation', [mdAuth.ensureAuth, mdAuth.isAdmin], stationController.createStation);
api.put('/updateStation/:idS', [mdAuth.ensureAuth, mdAuth.isAdmin], stationController.updateStation);
api.delete('/deleteStation/:idS', [mdAuth.ensureAuth, mdAuth.isAdmin], stationController.deleteStation);

// Public read routes — no authentication required
api.get('/getStations', stationController.getStations);

api.get('/getPoliceStations', stationController.getPoliceStations);
api.get('/getNationalStationsP', stationController.getNationalStationsP);
api.get('/getMunicipalStationsP', stationController.getMunicipalStationsP);

api.get('/getFireStations', stationController.getFireStations);
api.get('/getMunicipalStationsF', stationController.getMunicipalStationsF);
api.get('/getVolunteerStationsF', stationController.getVolunteerStationsF);

module.exports = api;
