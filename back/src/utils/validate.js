'use strict'

const bcrypt = require('bcrypt-nodejs');

exports.validateData = (data)=>{
    let keys = Object.keys(data), msg= '';

    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `The param ${key} is required\n`
    }return msg.trim();
}

exports.encrypt =(password)=>{
    try{
        return bcrypt.hashSync(password);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPermission = async (id, sub)=>{
    try{
        if(id != sub){
            return false;
        }else{
            return true;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPassword = (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash)
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkParams = async (params)=>{
    try{
        if(Object.entries(params).length === 0) return false
    return true
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (params)=>{
    try{
        if(
            params.user || 
            params.address ||
            params.lat || 
            params.lng
        ) return false;
            
        return true;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteSensitiveData = async(params)=>{
    try{
        delete params.user.password;
        delete params.user.role;
        return params;
    }catch(err){
        console.log(err);
        return err;
    }
}

