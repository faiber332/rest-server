const express = require("express");
const bodyParser = require("body-parser")
const app = express();

require("./config/config")

app.use(express.urlencoded({ extended: false })); 
app.use(express.json());

app.get("/usuarios",(req,res)=>{
    res.json("get usuarios")
})

 
app.post("/usuarios",(req,res)=>{

    let body = req.body

    if(body.nombre === undefined){
        res.status(400)
        res.json({
            ok:false,
            mensaje:"falto el nombre"
        })
    }else{
        res.json({
            persona: body
        })
    }

})
app.put("/usuarios/:id",(req,res)=>{
    let id = req.params.id

    res.json({id})
})
app.delete("/usuarios",(req,res)=>{
    res.json("delete usuarios")
})






app.listen(process.env.PORT,()=>{
    console.log("Corriendo en el puerto",process.env.PORT)
})