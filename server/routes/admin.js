const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const adminLayout = '../views/layouts/admin';
const jwtSecrect = process.env.JWT_SECRET;


/**
 * 
 * Check - login page
 */
const authMiddleware = (req, res, next ) => {
  const token = req.cookies.token;

  if(!token){
    return res.status(401).json({ message: 'No autorizado'});
  }

  try {
    const decoded = jwt.verify(token, jwtSecrect);
    req.userId = decoded.userId;
    next();
  }catch(error){
    return res.status(401).json({ message: 'No autorizado'});
  }
}




/**
 * GET 
 * Admin - login page
 */

 router.get('/admin', async (req, res) => {
   
  try {

    const locals = {
        title: "Administración",
        description: "Administración del blog de Son tiempos diferentes"
       }
   
     res.render('admin/index', { locals, layout: adminLayout });
   } catch (error) {
     console.log(error);
  }

 });


/**
 * POST
 * Admin - check login
 */

router.post('/admin', async (req, res) => {
   
  try {

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if(!user) {
      return res.status(401).json( { message: 'Credenciales no válidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      return res.status(401).json( { message: 'Credenciales no válidas' });
    }
  

    const token = jwt.sign({ userId: user._id}, jwtSecrect );
    res.cookie('token', token, { httpOnly: true });

    res.redirect('/dashboard');


   } catch (error) {
     console.log(error);
  }

 });

 /**
 * GET
 * Admin - Dashboard
 */

router.get('/dashboard', authMiddleware, async (req, res) => {


   try{
    const locals =  {
      title: 'Panel',
      description: 'Panel de administrador.'
    }


     const data = await Post.find();
     res.render('admin/dashboard', {
       locals,
       data,
       layout: adminLayout
     });


   }catch (error) {
     console(error);
   }



});


 /**
 * GET
 * Admin - Create New Post
 */

 
router.get('/add-post', authMiddleware, async (req, res) => {


  try{
   const locals =  {
     title: 'Agregar Publicación',
     description: 'Panel de administrador.'
   }


    const data = await Post.find();
    res.render('admin/add-post', {
      locals,
      layout: adminLayout
    });


  }catch (error) {
    console(error);
  }

});



 /**
 * POST
 * Admin - Create New Post
 */

  
router.post('/add-post', authMiddleware, async (req, res) => {


  try{
    try{
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body
      });

      await Post.create(newPost);
      res.redirect('/dashboard');
    } catch (error){
       console.log(error);
    }


  }catch (error) {
    console(error);
  }

});


/**
 * GET
 * Admin - Create New Post
 */

  
router.get('/edit-post/:id', authMiddleware, async (req, res) => {

  try{


    const locals = {
      title: 'Editar Publicación',
      description: 'Editando publicaciones'
    }
   
    const data = await Post.findOne({ _id: req.params.id });

    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout
    })
 
   }catch (error) {
     console(error);
   }
 
 });


/**
 * PUT
 * Admin - Create New Post
 */

  
router.put('/edit-post/:id', authMiddleware, async (req, res) => {

  try{
   
    await Post.findByIdAndUpdate(req.params.id, {
     title: req.body.title,
     body: req.body.body,
     updateAt: Date.now()
    });

    res.redirect(`/edit-post/${req.params.id}`);
 
   }catch (error) {
     console(error);
   }
 
 });










router.post('/register', async (req, res) => {
   
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
   
    try {
     const user = await User.create({ username, password:hashedPassword });
     res.status(201).json({ message: 'Usuario creado correctamente', user });
    }catch(error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'Usuario ya en uso' });
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
     
   } catch (error) {
     console.log(error);
  }

 });

 /**
 * DELETE /
 * Admin - Delete Post
*/
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

  try {
    await Post.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }

});


 /**
 * GET /
 * Admin - Logout
*/

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  // res.json({ message: 'Logout successful.' });
  res.redirect('/');
});



module.exports = router;
