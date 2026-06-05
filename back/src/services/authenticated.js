'use strict'

const jwt = require('jsonwebtoken');

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La solicitud no contiene la cabecera de autenticación' });
    }

    try {
        const secretKey = process.env.JWT_SECRET;
        var token = req.headers.authorization.replace(/['"]+/g, '');
        var payload = jwt.verify(token, secretKey);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Token expirado' });
        }
        return res.status(404).send({ message: 'El token no es válido' });
    }

    req.user = payload;
    next();
};

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.role === 'ADMIN') return next();
        else return res.status(403).send({ message: 'Usuario no autorizado' });
    } catch (err) {
        console.log(err);
        return err;
    }
};
