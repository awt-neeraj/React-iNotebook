const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    obj ={
        name:'Neeraj Adhikari',
        Age: '37'
    }
    res.json(obj)
})

module.exports = router