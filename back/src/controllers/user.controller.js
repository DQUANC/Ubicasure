'use strict'

const jwt = require('../services/jwt');
const User = require('../models/user.model');
const { validateData, encrypt, checkPassword } = require('../utils/validate');

exports.createAdmin = async () => {
    try {
        if (!process.env.ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD env var is not set');
        const password = await encrypt(process.env.ADMIN_PASSWORD);
        const data = {
            name: 'Daniel Quan',
            username: 'SuperAdmin',
            email: 'danielquan.c@gmail.com',
            password,
            role: 'ADMIN'
        };
        const result = await User.findOneAndUpdate(
            { username: data.username },
            { $set: data },
            { upsert: true, new: true }
        );
        console.log(`Admin user ${result.isNew ? 'created' : 'updated'}`);
    } catch (err) {
        console.error('Error creating admin:', err);
    }
};
//FUNCIONES PÚBLICAS

exports.register = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password,
            role: 'CLIENT'
        };

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let userExist = await User.findOne({username: params.username});
        if(userExist) return res.status(400).send({message: `Usuario ${params.username} ya existe`});
        data.surname = params.surname;
        data.password = await encrypt(params.password);

        let user = new User(data);
        await user.save();
        return res.send({message: 'Usuario creado satisfactoriamente'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error registrando usuario'}) ;
    }
}

exports.login = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            username: params.username,
            password: params.password
        };
        
        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let userExist = await User.findOne({username: params.username});

        if(userExist && await checkPassword(params.password, userExist.password)){
            let token = await jwt.createToken(userExist);
            delete userExist.password;

            return res.send({token, user:userExist, message: 'Logueado satisfactoriamente'});
        }else return res.status(401).send({message: 'Credentiales inválidas'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error logueandose'});
    }
};