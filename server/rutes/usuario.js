
const bcrypt = require("bcrypt-nodejs")
const express = require("express");
const app = express();
const Usuario = require("../models/usuario")
const _ =  require("underscore")
const {verificarToken,verificarRolAdmin} = require("./../midleware/autorizacion")
app.get("/usuarios",verificarToken,(req,res)=>{

    let inicio = Number(req.query.desde || 0)
    let limite = Number(req.query.limite || 5)

    Usuario.find({estado:true},"email nombre estado")
    .skip(inicio) // mostrar apartir de quito primero
    .limit(limite) // limita a una visualizacion de 5
    .exec((err,usuariosDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }

        

        // permite el contar cuantos resultados fueron obtenidos
        Usuario.countDocuments({estado:true},(err,conteo)=>{
            return res.json({
                ok:true,
                usuario:usuariosDB,
                cuantos:conteo
            })
        })



    })
    
    
})

 
app.post("/usuarios",[verificarToken,verificarRolAdmin],(req,res)=>{
    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        role: body.role
    })

    usuario.save((err)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                messaje:"no se ha podido enviar su usuario",
                error:err
            })
        }

        // para que no muestre el hash lo muestra null en pantalla
        // usuario.password = null

        return res.json({
            ok:true,
            messaje:"hemos registrado su usuario",
            usuario
        })
    })


    // if(body.nombre === undefined){
    //     res.status(400)
    //     res.json({
    //         ok:false,
    //         mensaje:"falto el nombre"
    //     })
    // }else{
    //     res.json({
    //         persona: body
    //     })
    // }

})

app.put("/usuarios/:id",[verificarToken,verificarRolAdmin],(req,res)=>{
    let id = req.params.id

    let body = _.pick(req.body,["nombre","email","role","estado"])

    Usuario.findByIdAndUpdate(id,body,{new:true, runValidators:true},(err,user)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }

        return res.json({
            ok:true,
            usuario:user
        })

    })

    
})
app.delete("/usuarios/:id",[verificarToken,verificarRolAdmin],(req,res)=>{
    let id = req.params.id
    
    /*

    //permite eliminar de forma permanente de la base de datos

    Usuario.findByIdAndRemove(id,(err,borrado)=>{
        if(err){
            res.status(400).json({
                ok:false,
                error:err
            })
        }

        if(!borrado){
            res.status(400).json({
                ok:false,
                error:{
                    nick: "/ds/dffg/sasd \ sds",
                    messaje: "Usuario no encontrado"
                }
            })
        }


        res.json({
            ok:true,
            usuario:borrado
        })
    })
    */


    Usuario.findByIdAndUpdate(id,{estado:false},{new:true},(err,user)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }


        if(!user){
            return res.status(400).json({
                ok:false,
                error:{
                    nick: "/ERROR/IDENTIFICATION/404 \ No Found",
                    messaje: "Usuario no encontrado"
                }
            })
        }

        return res.json({
            ok:true,
            Eliminado: user
        })
    })
})

module.exports = app