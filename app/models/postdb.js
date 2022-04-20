const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    post : {
        type : String,
        required : true
    }
})

const Postdb = mongoose.model('postdb', schema);

module.exports = Postdb;