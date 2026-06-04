'use strict'

const mongoose = require('mongoose');

const stationSchema = mongoose.Schema({
    lat: Number,
    lng: Number,
    name: String,
    type: String,
    phone: String,
    address: String,
    rating: Number,
    businessHours: String,
    user: {type: mongoose.Schema.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Station', stationSchema);