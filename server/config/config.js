

// PUERTOS ya que heroku utiliza uno diferente


process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || "DEV"

// almacena la url de la database
var url;

if(process.env.NODE_ENV == "DEV"){
    url = "mongodb://localhost:27017/cafe"
    
}else{

    url = process.env.MONGO_URI
}

process.env.URLDB = url