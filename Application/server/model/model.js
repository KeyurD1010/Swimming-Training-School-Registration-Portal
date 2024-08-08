const mongoose = require('mongoose');

var Userschema = new mongoose.Schema({
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

const User  = mongoose.model('User',Userschema);

module.exports = User;
