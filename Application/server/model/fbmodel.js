const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
   username:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required:true,
        min:0,
        max:5,
    },
    branch:{
        type:String,
        required:true,
    },
     feedback:{
        type: String,
    },
    date:{
        type: String
    }
});

const Feedback  = mongoose.model('Feedback',feedbackSchema);

module.exports = Feedback;