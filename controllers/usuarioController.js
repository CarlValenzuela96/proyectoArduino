'use strict'

const Monitor = require('../models/Monitor')
const Usuario = require('../models/Usuario');
const band = require('../controllers/pulseraController');

function getUsuariosMe(req,res){
 
   Monitor.findById(req.monitor.id).populate('usuarios').exec((err,monitor)=>{
    if(err) return res.status(500).send(err);
    if(!monitor) return res.status(404).send({"Error":"No existe monitor con esa id"});
    if(!monitor.usuarios || monitor.usuarios.length==0) return res.status(404).send({"Error":"Monitor no tiene usuarios a su cargo"});

    return res.status(200).send(monitor.usuarios);
    
   });
}

function getUsuarios(req,res){
    Usuario.find().populate('monitor').exec((err,usuarios)=>{
        if(err) return res.status(500).send(err);
        if(!usuarios) return res.status(500).send({"Error":"No hay usuarios registrados en el sistema"});
        return res.status(200).send(usuarios);
    });
}

function getUsuarioPorId(req,res){

    Usuario.findById(req.params.usuarioId).populate('monitor').exec((err,usuario)=>{
        if(err) return res.status(500).send(err);
        if(!usuario) return res.status(500).send({"Error":"No hay usuario registrado en el sistema con esa id"});
        return res.status(200).send(usuario);
    });
}

async function createUsuario(req,res){
    var infoBand = await band.getBandInfo(global.miband)
    
    Monitor.findById(req.monitor.id).populate('usuarios').exec((err,monitor)=>{
        if(err) return res.status(500).send(err);
        if(!monitor) return res.status(404).send({'Error':'No existe monitor con esa id'});

        const usuario = new Usuario({
            nombre:req.body.nombre,
            apellido:req.body.apellido,
            edad:req.body.edad,
            serial_pulsera:infoBand.serial,
            monitor:monitor._id
        });

        Usuario.findOne({
            serial_pulsera:infoBand.serial
        }).exec((err,userFound)=>{
            if(err) return res.status(500).send(err);
            if(userFound) return res.status(404).send({'Error':'Ya existe usuario con esa pulsera'});

            monitor.usuarios.push(usuario);

            usuario.save((err)=>{
                if(err) return res.status(500).send(err);

                monitor.save((err)=>{
                    if(err) return res.status(500).send(err);
                    return res.status(200).send(usuario);
                });
                
            });
        })
    });
    
}

function editUsuario(){

}

function deleteUsuario(){

}

module.exports = {
    createUsuario,
    deleteUsuario,
    editUsuario,
    getUsuarioPorId,
    getUsuarios,
    getUsuariosMe
};

