const mongoose = require('mongoose');

var Adminschema = new mongoose.Schema({
   username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 5
    }
});

const Admin  = mongoose.model('Admin',Adminschema);

module.exports = Admin;
