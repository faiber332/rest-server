// token google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

// ---

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

})



// configuraciones google valida el token
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    
    // retorna esto si la verificacion es exitosa
    return {
        nombre: payload.name,
        email: payload.email,
        picture: payload.picture,
        google: true
    }
  }
//   verify().catch(console.error);


// servicio google
app.post("/google-sign",async (req,res)=>{

    let token = req.body.idtoken

    let userGoogle = await verify(token)
        .catch(error=>{
            return res.status(403).json({
                ok: false,
                error
            })
        })

    Usuario.findOne({email:userGoogle.email},(error,usuarioDB)=>{
        if(error){
            return res.status(404).json({
                ok:false,
                error
            })

        }

        if(usuarioDB){

            if(usuarioDB.google == false){
                res.status(500).json({
                    ok:false,
                    message: "Su email ya esta registrado como un usuario normal"
                })
            }else{
                let token = jwt.sign({
                    usuario: usuarioDB 
                },process.env.SEED,{expiresIn: process.env.VENCT })

                return res.json({
                    token,
                    usuario:usuarioDB,
                    message: "Su email ya esta registrado con google"
                })
            }
        }else{
            
            // si no existe el usuario
            let usuario = new Usuario();

            usuario.nombre = userGoogle.nombre
            usuario.email = userGoogle.email,
            usuario.img = userGoogle.picture,
            usuario.password = "NO ENSAMBLADA"
            usuario.google = true
            console.log(usuario)
            usuario.save((error, usuarioDB)=>{
                if(error){
                    return res.status(400).json({
                        ok:false,
                        error
                    })
                }
                
                let token = jwt.sign({
                    usuario: usuarioDB 
                },process.env.SEED,{expiresIn: process.env.VENCT })

                return res.json({
                    token,
                    usuario:usuarioDB
                })
            })


        }
    })



})

module.exports = app