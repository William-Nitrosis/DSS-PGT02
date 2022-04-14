const express = require('express');
const route = express.Router()

const services = require('../services/render');
const controller = require('../controller/controller');

route.get('/home',services.homeRoutes);

route.get('/add-post',services.add_post);

route.get('/update-post',services.update_post);


//API

route.post('/api/posts',controller.create);
route.get('/api/posts',controller.find);
route.put('/api/posts/:id',controller.update);
route.delete('/api/posts/:id',controller.delete);




  module.exports = route