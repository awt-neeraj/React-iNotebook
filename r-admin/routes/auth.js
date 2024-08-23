const { request } = require('express');
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//Create a user using:POST "/api/auth/". Doesn't reqruied Auth
router.post('/',[
    body('name', 'Name should be at least 3 characters.').isLength({min:3}),
    body('email', 'Enter a valid email address.').isEmail(),
    body('password', 'Password should be at least 5 characters.').isLength({min:5}),
], (req, res) =>{
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.send({ errors: result.array() });
    }
    
    User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
      }).then(user => res.json(user)).catch(err => {res.json({error: 'Please enter a unique email address.'})}); 
})

module.exports = router