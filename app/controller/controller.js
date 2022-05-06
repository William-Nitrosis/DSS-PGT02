var validator = require('validator');

var Post = require('../models/post');

// create and save new post
exports.create = (req, res) => {
    // validate request
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    // clean inputs
    req.user.name = validator.escape(req.user.name);
    req.user.id = validator.escape(req.user.id);
    req.body.post = validator.escape(req.body.post);

    // new post
    const post = new Post({
        name: req.user.name,
        userid: req.user.id,
        content: req.body.post,
    })

    // save post in the database
    post
        .save(post)
        .then(data => {
            res.redirect('/posts');
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while creating a create operation" });
        });
}

// retrieve and return all posts/ retrive and return a single post
exports.find = (req, res) => {
    if (req.query.id) {
        const id = validator.escape(req.query.id);

        Post.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found post with id " + id });
                } else {
                    res.send(data);
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: "Erro retrieving post with id " + id });
            })
    } else {
        Post.find()
            .then(post => {
                res.send(post);
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error Occurred while retriving post information" });
            })
    }
}

// Update a post by post id
exports.update = async (req, res) => {
    // validate request
    if (!req.body) {
        return res.status(400).send({ message: "Data to update can not be empty" });
    }

    // clean inputs
    req.body.post = validator.escape(req.body.post);
    const id = validator.escape(req.params.id);

    console.log("trying to update id: " + id);

    // find update post content
    const post = await Post.findById(id).exec();
    post.content = req.body.post;

    // only allow post update when the current user is the same as the post owner
    if (post.userid === req.user.id) {
        // save updated post to db
        post.save()
            .then((data) => {
                console.log("Saved to db: " + data);
                res.send(data);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: "Error Update post information" });
            });
    } else {
        console.log("IDs are not equal. Expected:" + post.userid + " Recieved:" + req.user.id);
        res.status(403).send({ message: "Error Update post information" });
    }
}

// Delete a post with specified post id in the request
exports.delete = async (req, res) => {
    // clean inputs
    const id = validator.escape(req.params.id);

    console.log("trying to delete id: " + id);

    // find post to delete
    const post = await Post.findById(id).exec();

    // only allow post deletion when the current user is the same as the post owner
    if (post.userid === req.user.id) {
        Post.findByIdAndDelete(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
                } else {
                    res.send({ message: "Post was deleted successfully!" });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: "Could not delete Post with id=" + id });
            });
    } else {
        console.log("IDs are not equal. Expected:" + post.userid + " Recieved:" + req.user.id);
        res.status(403).send({ message: "Error deleting post" });
    }
}