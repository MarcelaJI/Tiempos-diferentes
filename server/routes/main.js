const express = require('express');
const router = express.Router();
const Post = require('../models/Post');



// Routes

/*
GET 
HOME

*/

router.get('', async (req, res) => {


    try {
        const locals = {
            title: "Son tiempos diferentes",
            description: "Bienvenidos a mi blog."
           }

    let perPage = 4;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ {$sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.countDocuments();
    
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);





      res.render('index', { 
        locals,
        data,
        current: page, 
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
    });


    } catch (error){
      console.log(error);
    }

});


/**
 * GET 
 * POST: id 
 */

router.get('/post/:id', async (req, res) => {
    try {
       
        let slug = req.params.id;

        const data = await Post.findById( { _id: slug });
        const locals = {

            title: data.title,
            description: "Bienvenidos a mi blog.",
            
       
           }


      
      res.render('post', { 
      locals,
       data,
      currentRoute: `/post/${slug}`
      
      });
    } catch (error){
      console.log(error);
    }

});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "index",
//     description: "Bienvenidos a mi blog."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });




router.get('/sobremi', (req, res) => {

    const locals = {
        title: "Sobre mí", 
    
    }
    res.render('sobremi', { 
     locals,
     currentRoute: '/sobremi'
     });
});


router.get('/contacto', (req, res) => {

    const locals = {
        title: "Contacto", 
    
    }
    res.render('contacto',{
     locals, 
     currentRoute: '/contacto'
    });
});






/*
function insertPostData () {
    Post.insertMany([
        {
          title: "Building a blog", 
          body: "This is the body text"
        },

        {
          title: "Building a blog", 
          body: "This is the body text"
        },

        {
          title: "Building a blog", 
          body: "This is the body text"
        },

        {
          title: "Building a blog", 
          body: "This is the body text"
        },

        {
          title: "Building a blog", 
          body: "This is the body text"
        },

        {
          title: "Building a blog", 
          body: "This is the body text"
        },
        {
          title: "Building a blog", 
          body: "This is the body text"
        },
    ])
}

 insertPostData();
 */


module.exports = router;