//integration codes:(the following)

//1. import mongoose
const mongoose=require("mongoose")

mongoose.connect('mongodb://localhost:27017/bankserver')

//create a model(in capital and singular) for collection (basic structure)
const User=mongoose.model('User',{
    acno:Number,
    uname:String,
    psw:String,
    balance:Number,
    transaction:[]
})

//export model
module.exports={
    User
}