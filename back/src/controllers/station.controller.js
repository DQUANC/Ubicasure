'use strict'

const Station = require('../models/station.model');
const { validateData, checkUpdate, checkParams, deleteSensitiveData } = require('../utils/validate');

exports.createStation = async (req, res) => {
    try {
        let params = req.body;
        let data = {
            lat: params.lat,
            lng: params.lng,
            name: params.name,
            type: params.type,
            phone: params.phone,
            address: params.address,
            rating: params.rating,
            businessHours: params.businessHours
        };
        let msg = validateData(data);
        if (msg) return res.status(400).send(msg);
        let stationExist = await Station.findOne({ name: params.name });
        if (stationExist) return res.status(400).send({ message: `Estación ${params.name} ya existe` });
        let locationExist = await Station.findOne({ lat: params.lat, lng: params.lng });
        if (locationExist) return res.status(400).send({ message: `Estación en coordenadas ${params.lat, params.lng} ya existe` });
        let addressExist = await Station.findOne({ address: params.address });
        if (addressExist) return res.status(400).send({ message: `Estación en dirección ${params.address} ya existe` });
        if ((params.lat > 14.678119039011102 || params.lng > -90.46753632421282) ||
            (params.lat < 14.525956147007097 || params.lng < -90.63782441015032))
            return res.status(400).send({ message: 'Las coordenadas exceden el límite de espacio' });
        if (params.rating > 5) return res.status(400).send({ message: 'La clasificación no puede ser mayor a 5' });
        data.user = req.user.sub;

        let station = new Station(data);
        await station.save();
        return res.send({ message: 'Estación creada satisfactoriamente' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error creando estación' });
    }
}

exports.updateStation = async (req, res) => {
    try {
        let stationId = req.params.idS;
        let params = req.body;

        let stationExist = await Station.findOne({ _id: stationId });
        if (!stationExist) return res.status(400).send({ message: `Estación no encontrada` });
        let emptyParams = await checkParams(params);
        if (emptyParams === false) return res.status(400).send({ message: 'Parametros vacíos' });
        let validateUpdate = await checkUpdate(params);
        if (validateUpdate === false) return res.status(400).send({ message: 'No puedes editar esta información' });
        let nameExist = await Station.findOne({ name: params.name });
        if (nameExist && params.name != stationExist.name) return res.status(400).send({ message: `Estación ${params.name} ya existe` });
        let addressExist = await Station.findOne({ address: params.address });
        if (addressExist && params.address != stationExist.address) return res.status(400).send({ message: `Estación en dirección ${params.address} ya existe` });
        if (params.rating != stationExist.rating && params.rating > 5) return res.status(400).send({ message: 'La clasificación no puede ser mayor a 5' });

        let stationUpdate = await Station.findOneAndUpdate({ _id: stationId }, params, { new: true });
        return res.send({ stationUpdate, message: 'Estación actualizada satisfactoriamente' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error actualizando estación' });
    }
}

exports.deleteStation = async (req, res) => {
    try {
        let stationId = req.params.idS;

        let stationExist = await Station.findOne({ _id: stationId });
        if (!stationExist) return res.status(400).send({ message: 'Estación no encontrada' });

        await Station.findOneAndDelete({ _id: stationId });
        return res.send({ station: stationExist.name, message: 'Estación eliminada' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error eliminando estación' });
    }
}

exports.getStations = async (req, res) => {
    try {
        let stations = await Station.find()
            .lean()
            .populate('user');

        for (let station of stations) {
            await deleteSensitiveData(station);
        };
        return res.send({ stations });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo estaciones' });
    }
}

exports.getPoliceStations = async (req, res) => {
    try {
        let stations = await Station.find({
            $or: [
                { type: 'Policia Nacional' },
                { type: 'Policia Municipal' },
            ]
        })
            .lean()
            .populate('user');

        for (let station of stations) {
            await deleteSensitiveData(station);
        };
        return res.send({ stations });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo estaciones' });
    }
}

exports.getNationalStationsP = async (req, res) => {
    try {
        let stations = await Station.find({ type: 'Policia Nacional' })
            .lean()
            .populate('user');

        for (let station of stations) {
            await deleteSensitiveData(station);
        };
        return res.send({ stations });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo estaciones' });
    }
}

exports.getMunicipalStationsP = async (req, res) => {
    try {
        let stations = await Station.find({ type: 'Policia Municipal' })
            .lean()
            .populate('user');

        for (let station of stations) {
            await deleteSensitiveData(station);
        };
        return res.send({ stations });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo estaciones' });
    }
}

exports.getFireStations = async (req, res) => {
    try {
        let stations = await Station.find({
            $or: [
                { type: 'Bombero Municipal' },
                { type: 'Bombero Voluntario' },
            ]
        })
            .lean()
            .populate('user');

        for (let station of stations) {
            await deleteSensitiveData(station);
        };
        return res.send({ stations });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo estaciones' });
    }
}

exports.getMunicipalStationsF = async (req, res) => {
    try {
        let stations = await Station.find({ type: 'Bombero Municipal' })
            .lean()
            .populate('user');

        for (let station of stations) {
            await deleteSensitiveData(station);
        };
        return res.send({ stations });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo estaciones' });
    }
}

exports.getVolunteerStationsF = async (req, res) => {
    try {
        let stations = await Station.find({ type: 'Bombero Voluntario' })
            .lean()
            .populate('user');

        for (let station of stations) {
            await deleteSensitiveData(station);
        };
        return res.send({ stations });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo estaciones' });
    }
}