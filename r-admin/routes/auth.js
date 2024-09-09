const { request } = require('express');
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Neerajisagoodb$oy";
//Create a user using:POST "/api/auth/createuser". Doesn't reqruied Auth
router.post('/createuser',[
    body('name', 'Name should be at least 3 characters.').isLength({min:3}),
    body('email', 'Enter a valid email address.').isEmail(),
    body('password', 'Password should be at least 5 characters.').isLength({min:5}),
], async (req, res) =>{
    //If there are errors, return Bed Request and the errors 
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.send({ errors: result.array() });
    }
    try {
      //Check whether the user exists already
      let user = await User.findOne({email: req.body.email});
      if(user){
        return res.status(400).json({error: "Sorry a user with this email already exists."});
      }
      //Create a new User
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
          name:req.body.name,
          email:req.body.email,
          password:secPass
      })
      const data = {
        user:{id:user.id}
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error")
    }
})

//Authenticate a user using:POST "/api/auth/login". Doesn't reqruied Auth
router.post('/login',[
  body('email', 'Enter a valid email address.').isEmail(),
  body('password', 'Password can not be blank').exists()
], async (req, res) =>{
  //If there are errors, return Bed Request and the errors 
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.send({ errors: result.array() });
  }
  const {email, password} = req.body;
  try {
    //Check whether the user exists already
    let user = await User.findOne({email: email});
    if(!user){
      return res.status(400).json({error: "Please try to login with correct credentials "});
    }
    const passcompare = await bcrypt.compare(password, user.password);
    if(!passcompare){
      return res.status(400).json({error: "Please try to login with correct credentials "});
    }
    const data = {
      user:{id:user.id}
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({authToken});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
})

module.exports = router