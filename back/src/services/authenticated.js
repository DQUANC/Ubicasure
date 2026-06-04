'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = 'Proyecto_Final';

exports.ensureAuth = (req,res,next)=>{
    if(!req.headers.authorization) return res.status(403).send({message: 'La solicitud no contiene la cabecera de autenticación'}); 
    
        try{
            var token = req.headers.authorization.replace(/['"]+/g, '');
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token expirado'});
            }
        }catch(err){
            return res.status(404).send({message: 'El token no es válido'});
        }
        req.user = payload;
        next();
    
};

exports.isAdmin = async (req, res, next)=>{
    try{
        if(req.user.role === 'ADMIN') return next();
        else return res.status(403).send({message: 'Usuario no autorizado'});
    }catch(err){
        console.log(err);
        return err;
    }
}
