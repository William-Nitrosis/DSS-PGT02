const express = require('express');
const router = express.Router()

const services = require('../services/render');
const controller = require('../controller/controller');
const {ensureAuthenticated} = require('../services/authentication');


router.get('/',ensureAuthenticated,services.posts);

router.get('/add-post',ensureAuthenticated,services.add_post);

router.get('/update-post',ensureAuthenticated,services.update_post);


//API

router.post('/api/posts',ensureAuthenticated,controller.create);
router.get('/api/posts',controller.find);
router.put('/api/posts/:id',ensureAuthenticated,controller.update);
router.delete('/api/posts/:id',ensureAuthenticated,controller.delete);



module.exports = router