const mongoose = require('mongoose');


var maleSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true
    },
    name:{
        type: String,
        required:true
        
    },
    email:{
        type : String,
        required:true
       
    },
    address:{
        type: String,
        required:true
     
    },
    contactNo:{
        type: Number,
        required:true
      
    },
    age:{
        type:Number,
        required:true
        
    },
    branchName:{
        type: String
    },
    plan:{
        type: Number
    },
    status:{
        type: String
    },
    date:{
        required:true,
        type: String
    },
    expiry:{
        required:true,
        type:String
    },
    gender:{
        type:String,
        default:"male"  
    }
});

const MaleSchema = mongoose.model('MaleSchema',maleSchema);

module.exports = MaleSchema;