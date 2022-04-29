const axios = require('axios');

exports.posts = (req, res) => {
    // Make a get request to /api/posts
    console.log("hi posts:"+req.user);

    axios.get('http://localhost:3000/posts/api/posts')
        .then(function(response){
            console.log(response);
            res.render('posts', { posts : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}
exports.add_post = (req,res) =>
{
    res.render('add_post');
}

exports.update_post = (req, res) =>{
    axios.get('http://localhost:3000/posts/api/posts', { params : { id : req.query.id }})
        .then(function(postdata){
            res.render("update_post", { post : postdata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}