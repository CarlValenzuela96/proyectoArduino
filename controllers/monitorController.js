'use strict'
const Monitor = require('../models/Monitor');

function getMonitores(req,res){
    Monitor.find().populate('usuarios').exec((err,monitores)=>{
        if(err) return res.status(500).send(err);
        if(!monitores) return res.status(404).send({'Error':'No existen monitores'});
        
        return res.status(200).send(monitores);
    });
}

function getMonitorPorId(req,res){
    Monitor.findById(req.params.monitorId).populate('usuarios').exec((err,monitor)=>{
        if(err) return res.status(500).send(err);
        if(!monitor) return res.status(404).send({'Error':'No existe monitor'});
        
        return res.status(200).send(monitor);
    });
}

function getMe(req,res){
    Monitor.findById(req.monitor.id).populate('usuarios').exec((err,monitor)=>{
        if(err) return res.status(500).send(err);
        if(!monitor) return res.status(404).send({'Error':'No existe monitor'});
        
        return res.status(200).send(monitor);
    });
}

function editMe(req,res){

}


module.exports = {
    getMe,
    getMonitorPorId,
    getMonitores,
    editMe
};