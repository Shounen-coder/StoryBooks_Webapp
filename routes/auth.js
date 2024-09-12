const express = require('express');
const passport = require('passport');
const Router = express.Router();

//auth with googel
//route GET/auth/google 
Router.get('/google', passport.authenticate('google', {scope: ['profile']   }));


//route GET/auth/google/callback
Router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        console.log("Authenticated user:", req.user);  // Check if user is set
        // Successful authentication, redirect to your desired page
        res.redirect('/dashboard');
    });

//log out route

Router.get('/logout',(req,res) =>{
    req.logout((err)=>{
        if(err) {
            return next(err);
}
})
    res.redirect('/')
})

module.exports = Router;