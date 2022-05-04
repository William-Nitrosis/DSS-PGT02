const mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    userid : {
        type: String,
        required: true,
    },
    content : {
        type : String,
        required : true
    }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;