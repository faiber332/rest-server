const mongoose = require("mongoose")
const UniqueValidator = require("mongoose-unique-validator")
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
let Schema = mongoose.Schema

let valRol = {
    values: ["ADMIN","USER","MONITOR","OPT"],
    message: '{VALUES} Este rol no esta permitido '
}

let usuarioSchema = new Schema({
    nombre :{
        type: String,
        required: [true,"nombre necesario"]
    },
    email:{
        type: String,
        index: true,
        unique: true,
        required: [true,"email requerido"]
    },
    password:{
        type:String,
        required: [true,"password obligatoria"]
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default: "USER",
        enum: valRol,
        
    },
    estado:{
        type: Boolean,
        default: true,
        required: [false, "estado necesario"]
    },
    google:{
        type: Boolean,
        default: false
    }
})

usuarioSchema.methods.toJSON = function(){
    let user = this
    let userObject = user.toObject()
    delete userObject.password

    return userObject
}

usuarioSchema.plugin(UniqueValidator,{message: '{PATH} email debe ser unico'})

module.exports = mongoose.model("Usuario",usuarioSchema)