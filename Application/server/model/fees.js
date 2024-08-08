const mongoose = require('mongoose');

var feeschema = new mongoose.Schema({
   malefee:{
        type: Number,
    },
    femalefee:{
        type: Number,
    },
    days:{
        type: Number,
    },
});

const Fee  = mongoose.model('Fee',feeschema);

module.exports = Fee;
