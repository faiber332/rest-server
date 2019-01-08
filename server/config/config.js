

// PUERTOS ya que heroku utiliza uno diferente


process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || "DEV"


var url;

if(process.env.NODE_ENV == "DEV"){
    url = "mongodb://localhost:27017/cafe"
    
}else{
    url = "mongodb://user23:kura2000@ds043200.mlab.com:43200/cafe"
}

process.env.URLDB = url