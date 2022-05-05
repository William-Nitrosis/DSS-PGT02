const axios = require('axios');
var Post = require('../models/post');
var validator = require('validator');

exports.posts = (req, res) => {
    // Make a get request to /api/posts for all posts
    axios.get('http://localhost:3000/posts/api/posts')
        .then(function(response){
            console.log(response);
            res.render('posts', { posts : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}
exports.add_post = (req,res) => {
    res.render('add_post');
}

exports.update_post = async (req, res) => {

    // check the current user owns the post
    const postid = validator.escape(req.query.id);
    const post = await Post.findById(postid).exec();
    if (post.userid === req.user.id) {    
        // Make a get request to /api/posts for post with id
        axios.get('http://localhost:3000/posts/api/posts', { params : { id : postid }})
            .then(function(postdata){
                res.render("update_post", { post : postdata.data})
            })
            .catch(err =>{
                res.send(err);
            })
    } else {
        console.log("Invalid User, IDs are not equal. Expected:"+post.userid+" Recieved:"+req.user.id);
        res.status(403).send({ message : "Error Occurred while retriving post information" });
    }
}