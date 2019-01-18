require("./config/config")
const mongoose = require('mongoose');

const express = require("express");
const bodyParser = require("body-parser")
const app = express();


// parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 

// parse aplication/json
app.use(bodyParser.json());


// configuracion global de rutas
app.use(require("./rutes/importador"))


// conexion a mongo
mongoose.connect(process.env.URLDB,{useNewUrlParser: true},(err,resp)=>{
    // si falla hace esto
    if(err) throw err

    console.log("base de datos online")
});



// conexion al puerto
app.listen(process.env.PORT,()=>{
    console.log("Corriendo en el puerto",process.env.PORT)
})