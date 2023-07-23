//import express
const express = require('express')

//to import logic.js
const logic = require('./services/logic')

//server creation
const server = express()

const jwt= require('jsonwebtoken')

//inbuilt method to convert incoming data to js
server.use(express.json())

//import cors
const cors = require('cors')

//connect front end (cors)
server.use(cors({ origin: "http://localhost:4200" }))




//port setting
server.listen(3000, () => {
    console.log("server is running")
})

//middleware here:
const tokenMiddleware=(req,res,next)=>{
    try{
        const token =req.headers["acess_token"]
        jwt.verify(token,"bankkey123")
        next()
    }
    catch{
        res.status(404).json({
            message:"token not verified",
            status:false,
            statuscode:404
        })
    }
   
}

//server api resolve
server.post('/getexc', (req, res) => {
    res.send("post request...")
})

//register-post
server.post('/register', (req, res) => {
    logic.register(req.body.acno, req.body.psw, req.body.uname).then(result => {
        //to convert js to json and send as a response 
        res.status(result.statuscode).json(result)
    })
})



//login-post
server.post('/login', (req, res) => {
    logic.login(req.body.acno, req.body.psw).then(result => {
        res.status(result.statuscode).json(result)
    })
})


//get user data-get
server.get('/getuser/:acno', tokenMiddleware,(req, res) => {
    logic.getUser(req.params.acno).then(result => {
        res.status(result.statuscode).json(result)
    })
})



//balance-get
server.get('/balance/:acno',tokenMiddleware, (req, res) => {
    logic.getBalance(req.params.acno).then(result => {
        res.status(result.statuscode).json(result)
    })
})
//money transfer-post
server.post('/transfer',tokenMiddleware, (req, res) => {
    logic.moneyTransfer(req.body.fromAcno, req.body.toAcno, req.body.psw, req.body.date, req.body.amount).then(result => {
        res.status(result.statuscode).json(result)
    })
})



//transaction history-get
server.get('/history/:acno',tokenMiddleware,(req,res)=>{
    logic.getTransaction(req.params.acno).then(result=>{
        res.status(result.statuscode).json(result)
    })
})
//ac delete-delete
server.delete('/deleteac/:acno',tokenMiddleware,(req,res)=>{
    logic.deleteAc(req.params.acno).then(result=>{
        res.status(result.statuscode).json(result) 
    })
})