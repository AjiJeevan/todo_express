const express = require("express")
const mongoose = require('mongoose'); 
const { route } = require("./taskRoutes");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const userModel = require("../models/userModels")

const router = express.Router()
const saltRounds = 10;
const encryptKey = "sdasda1213"


router.get("/",async (req,res)=>{
    const users = await userModel.find()
    res.json({users})
})

router.post("/register",(req,res)=>{
    console.log(req.body)
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, async function(err, hash) {
            if(hash){
                const newUser = await userModel.create({...req.body, password:hash})
                res.send({message: "User Created Successfully"})
            }
            else{
                res.status(400).json({message : "Something went wrong"})
            }
            
        });
    });
})

router.post("/login",async (req,res)=>{
    const emailId = req.body.email
    const  password = req.body.password
    const user = await userModel.findOne({email : emailId})
    bcrypt.compare(password, user.password, function(err, result) {
        if(result){
            console.log(user)
            var token = jwt.sign({ email : emailId }, encryptKey);
            res.send({message: "Logged in Successfully" , token : token})
        }
        else{
            res.status(400).json({message : "Invalid Credentials"})
        }
    });
    
})

router.post("/check-token",(req,res)=>{
    let token = req.body.token
    let user = jwt.verify(token,encryptKey)
    console.log(user)
    if(user.email){
        res.send("Success")
    }
    else(
        res.status(401).json({message : "Invalid token"})
    )
    
})

router.put("/:id",(req,res)=>{
    res.send("Edit user")
})

router.delete("/:id",async (req,res)=>{
    await userModel.findByIdAndDelete(req.params.id)
    res.send("Deleted User")
})



module.exports = router
