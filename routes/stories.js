const express = require('express');
const Router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');

const Story = require('../models/Story');

//show add page
//@route Get/ stories/add
Router.get('/add', ensureAuth,(req, res) =>{

res.render('stories/add');

});

//Process add form
//@route POST/ stories
Router.post('/', ensureAuth,async(req, res) =>{

try {
    req.body.user = req.user.id
    await Story.create(req.body)
    res.redirect('/dashboard');  
} catch (error) {
    console.log(error);
    res.render('error/500');
}

});

//show all stories
//@route Get/ stories
Router.get('/', ensureAuth,async(req, res) =>{

    try {
     const stories = await Story.find({status: 'public'})
     .populate('user')
     .sort({createdAt: 'desc'})
     .lean()

     res.render('stories/index',{
         stories
     });


    } catch (error) {
        console.log(error); 
        res.render('error/500');
    }
    
    });

//show single story
//@route Get/ stories/id
Router.get('/:id', ensureAuth,async(req, res) =>{

    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()

        if(!story){
            return res.status(404).render('error/404');
        }

        res.render('stories/show',{
            story
        });
    } catch (error) {
        console.log(error)
        res.render('error/500');
    }
    
    });
//show edit page
//@route Get/ stories/edit/:id
Router.get('/edit/:id', ensureAuth,async(req, res) =>{
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
    
        if(!story){
            return res.status(404).render('error/404');
        }
    
        if(story.user != req.user.id){
            response.redirect('/stories')
        }else{
            res.render('stories/edit',{
                story
            });
        }
    } catch (error) {
        console.error(error);
        res.render('error/500');
    }
    
    
    })

//show Update Story
//@route PUT/stories/:id
Router.put('/:id', ensureAuth,async(req, res) =>{
    try {
        let story = await Story.findById(req.params.id).lean()

    if(!story){
        return res.render('error/404')
    }

    if(story.user!= req.user.id){
        res.redirect('/stories')
    }else{
        story = await Story.findOneAndUpdate({_id: req.params.id},req.body,{
            new: true,
            runValidators: true,
        })
        res.redirect('/dashboard')
        }
    }catch (error) {
        console.error(error)
        res.render('error/500')
    }
});


    

//show Delete story
//@route DELETE/ stories/:id
Router.delete('/:id', ensureAuth,async(req, res) =>{

    try {
        await Story.deleteOne({_id:req.params.id})
        res.redirect('/dashboard')
        
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
    
    });

/// @desc    User stories
// @route   GET /stories/user/:userId
Router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
    .populate('user')
    .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})
    
Router.get('/search/:query', async (req, res) =>{
    try {
        const stories = await Story.find({title: new RegExp(req.query.query,'i'),status: 'public'})
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean()

        res.render('stories/index',{
            stories
        })
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})



module.exports = Router;