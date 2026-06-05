'use strict'

const jwt = require('jsonwebtoken');

exports.createToken = async (user) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        let payload = {
            sub: user._id,
            username: user.username,
            password: user.password,
            name: user.name,
            surname: user.surname,
            phone: user.phone,
            email: user.email,
            role: user.role
        };
        return jwt.sign(payload, secretKey, { expiresIn: '24h' });
    } catch (err) {
        console.log(err);
        return err;
    }
};
