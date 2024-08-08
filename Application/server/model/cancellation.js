const mongoose = require('mongoose');

var cancellation = new mongoose.Schema({
    username:{
        type:String
    },
    cancelReqID:{
        type:String
    },
    cancelReqDate:{
        type:String
    }

});

const CancelReqName = mongoose.model('CancelReqName',cancellation);

module.exports = CancelReqName;
