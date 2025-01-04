const express = require("express")
const router = express.Router()
const mongoose = require('mongoose') 
var jwt = require('jsonwebtoken');
const userModel = require("../models/userModels")

const encryptKey = "sdasda1213"

const TaskSchema = new mongoose.Schema({
    task: {type : String},
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
    // isCompleted : {type : Boolean, default :false}
  });

const task = mongoose.model('Tasks',TaskSchema) 

router.get("/",async(req,res)=>{
    let token = req.headers.authorization
    let userEmail = jwt.verify(token,encryptKey)
    let user = await userModel.findOne({email : userEmail.email})
    task.find({userId : user._id})
    .then(todoList =>{
        // console.log(todoList)
        res.json({todoList})
    })
    .catch(err =>{
        console.log(err)
    })
    //Without MongoDB
    // res.json(tasks)
})

router.post("/",async(req, res)=>{
    console.log(req.body)
    // task.create([{ task: 'check mail' }, { task: 'send mail' }]);
    const token = req.body.token
    let userEmail = jwt.verify(token,encryptKey)
    let user = await userModel.findOne({email : userEmail.email})
     task.create({task : req.body.task , userId : user._id})
    //  task.create({task : req.body[0].task})

    //Without MongoDB
    // tasks.push({
    //     _id:tasks.length+1,
    //     task:req.body.task
    // })
    // console.log(tasks)
    res.send("Success")
})

router.delete("/task/:id",(req,res)=>{
    console.log(req.params)
    task.findByIdAndDelete(req.params.id)
    .then(data =>{
        if(data){
            res.send("Deleted")
        }
        else{
            res.status(404).json({"message":"Invalid index"})
        }}
    )
    .catch(err =>{
        res.status(404).json({"message":"Invalid index"})
    })
    //Without MongoDB
    // if(req.params.index < tasks.length){
    //     tasks.splice(req.params.index,1)
    //     res.send("Task deleted from the list")
    // }
    // else{
    //     res.status(404).json({"message":"Invalid index"})
    // }

})

router.patch("/", (req,res)=>{

    let id = req.body.id
    let newtask = req.body.task
    task.findByIdAndUpdate(id, { task: newtask })
    .then(data =>{
        console.log(data)
        res.send("Task Updated")
    })
    .catch(err=>{
        res.status(404).json({"message":"Update failed"})
    })


    //Without MongoDB
    // let index = req.body.id
    // let newTask = req.body.task
    // tasks[index].task = newTask
    // console.log(req.body)

})

module.exports = router