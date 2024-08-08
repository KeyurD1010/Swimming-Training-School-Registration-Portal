const mongoose = require("mongoose");

const connectDB = async ()=>{
  try{  
    //await mongoose.connect('mongodb+srv://projectDB:dbprojectDB@cluster.xkg7p.mongodb.net/projectDB?retryWrites=true&w=majority');
    console.log("mongo has connected");
  }
  catch(err){
    console.log(err);
    process.exit(1);
  }
}

module.exports = connectDB;
