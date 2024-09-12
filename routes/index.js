const express = require('express');
const Router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');

const Story = require('../models/Story');


Router.get('/', ensureGuest,(req, res) =>{

res.render('login', { layout: 'login' });

});

Router.get('/dashboard',ensureAuth,async(req, res) => {

  try {
    // console.log("Inside /dashboard route. res.locals.user:", res.locals.user);
    const stories = await Story.find({user: req.user.id}).lean()
    // console.log('Logged in user: ',req.user)  
    res.render('dashboard',{
      name: req.user.firstName,
      stories
    })
  } catch (error) {
    console.error(error)
    res.render('error/500')
  }
    
});

module.exports = Router;