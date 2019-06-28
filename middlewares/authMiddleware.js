'use strict'

const jwt = require('jsonwebtoken');
const Monitor = require('../models/Monitor');
const config = require('../config');

function isAuth(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({'Error':'Debe estar logeado'});
    }

    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.decode(token,config.secret);

    Monitor.findById(payload.id).exec((err,monitor)=>{
        if(err) return res.status(406).send({'Error':'No se encontro monitor asociado a la sesión'});
        if(monitor.token!=token) return res.status(403).send({'Error':'Token ya expiro'});
        req.monitor = monitor;
        next();
    });
}

module.exports = {
    isAuth
};