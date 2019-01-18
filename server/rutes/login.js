const bcrypt = require("bcrypt-nodejs")

const jwt = require("jsonwebtoken")

const express = require("express");
const Usuario = require("../models/usuario")
const app = express();

app.post("/loguin",(req,res)=>{

    let body = req.body

    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                error:err
            })
        }

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                messaje:"(Usuario) y contraseña no encontrado intente con otro usuario"
            })
        }
        // compara y devuelve positivo si es correcta
        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                messaje: "contraseña fallada"
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB 

        //palabra para la firma
        // segundos * minutos * horas * dias
        },process.env.SEED,{expiresIn: process.env.VENCT })

        return res.json({
            ok:true,
            usuario: usuarioDB,
            extras: {
                token
            },
            messaje: "usuario logueado",
        })

    })


    // return res.json({
    //     ok:true
    // })
})

module.exports = app