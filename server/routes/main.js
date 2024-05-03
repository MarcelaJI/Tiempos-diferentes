const express = require('express');
const router = express.Router();


// Routes

router.get('', (req, res) => {

    const locals = {
     title: "Son tiempos diferentes",
     description: "Bienvenidos a mi blog."

    }
    res.render('index', { locals });
});

router.get('/sobremi', (req, res) => {

    const locals = {
        title: "Sobre mí", 
    
    }
    res.render('sobremi', { locals });
});


router.get('/contacto', (req, res) => {

    const locals = {
        title: "Contacto", 
    
    }
    res.render('contacto', { locals });
});



module.exports = router;