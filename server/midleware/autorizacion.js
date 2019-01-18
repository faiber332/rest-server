
const jwt = require("jsonwebtoken")

// autorizacion token
let verificarToken = (req,res,next)=>{
    let token = req.get("token") // el nombre como se envio en el header

    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        // evalua si es valido el token
        if(err){
            return res.status(401).json({
                ok:false,
                err
            })
        }

        req.usuario = decoded.usuario

        // continua
        next()
    })


}

let verificarRolAdmin = (req,res,next)=>{
    let usuario = req.usuario

    if(usuario.role=="ADMIN"){
        
        next()

    }else{
        res.status(400).json({
            ok:false,
            usuario:"no es administrador"
        })
    }
}

module.exports = {
    verificarToken,
    verificarRolAdmin
}