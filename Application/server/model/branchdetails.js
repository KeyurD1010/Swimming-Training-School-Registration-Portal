const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const BranchDetails = new mongoose.Schema({

    branchName:{
        type: String,
        required : true
    },
    zone:{
        type: String,
        required: true
    },
    address:{
        type : String,
        required : true
    },
    contactNo:{
        type: String,
        required: true
    },
    noOfSlot:{
        type: Number,
        required : true
    },
    image1:{
        type: String
    },
    image2:{
        type: String
    },
    description:{
        type:String
    }

});

const Branchdetails = mongoose.model('Branchdetails',BranchDetails);

module.exports = Branchdetails;