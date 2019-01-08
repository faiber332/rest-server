require("./config/config")
const mongoose = require('mongoose');

const express = require("express");
const bodyParser = require("body-parser")
const app = express();


app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(require("./rutes/usuario"))


mongoose.connect(process.env.URLDB,{useNewUrlParser: true},(err,resp)=>{
    if(err) throw err

    console.log("base de datos online")
});




app.listen(process.env.PORT,()=>{
    console.log("Corriendo en el puerto",process.env.PORT)
})