'use strict'

const Monitor = require('../models/Monitor');
const Service = require('../services/services');
const bcrypt = require('bcrypt-nodejs');
const fetch = require("node-fetch");

//Para encryptar pass monitor
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

function registrarMonitor(req,res){

    Monitor.findOne({
        nombreUsuario: req.body.nombreUsuario
    }).exec((err,monitor)=>{
        if(err) return res.status(500).send(err);
        if(monitor) return res.status(404).send({'Error':'Ya existe Monitor con ese nombre de usuario'});

        var hashPass = bcrypt.hashSync(req.body.password,salt);

        const newMonitor = new Monitor({
            nombreUsuario : req.body.nombreUsuario,
            nombre : req.body.nombre,
            apellido : req.body.apellido,
            password : hashPass
        });

        newMonitor.save((err)=>{
            if(err) return res.status(500).send(err);
            
           /*  (async () => {
                const rawResponse = await fetch('http://endor.ceisufro.cl:8080/api/v1/HrnpIQLJ5pPzRjPQ1g3U/telemetry', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({monitor: "newMonitor"})
                });
                const content = await rawResponse.json();
              
                console.log(content);
              })(); */

            return res.status(200).send(newMonitor);
        })

    });

}

function loginMonitor(req,res){
    Monitor.findOne({
        nombreUsuario: req.body.nombreUsuario
    }).select("+password").exec((err,monitor)=>{
        if(err) return res.status(500).send(err);
        if(!monitor) return res.status(404).send("No existe monitor con ese nombre de usuario");

        bcrypt.compare(req.body.password, monitor.password,(err,decrypt)=>{
            if(err) return res.status(500).send(err);
            if( decrypt){
                var token = Service.createToken(monitor);
                monitor.token = token;

                monitor.save((err)=>{
                    if(err) return res.status(401).send(err);

                    return res.status(200).send({'token':token});
                })
            }else{
                return res.status(401).send({'Error':'Contraseña no corresponde'});
            }
        })
    });
}

module.exports = {
    loginMonitor,
    registrarMonitor
}