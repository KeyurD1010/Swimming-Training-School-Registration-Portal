const mongoose = require('mongoose');

var femaleSchema = new mongoose.Schema({

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
        type: Number,
      
    },
    status:{
        type: String
    },
    date:{
        type: String,
        required:true
    },
    expiry:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        default:"female"  
    }
});

const FemaleSchema = mongoose.model('FemaleSchema',femaleSchema);

module.exports = FemaleSchema;