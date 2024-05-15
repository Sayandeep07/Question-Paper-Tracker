const mongoose=require("mongoose")
const prof =  mongoose.Schema({
    profName:{
        type:String,
        required:true
    },
    profEmail:{
        type:String,
        required:true
    },
    profID:{
        type:Number,
        required:true
    },
    profGender:{
        type:String,
        required:true
    },
    profSub:{
        type:String,
        required:true
    },
    profpass:{
        type:String,
        required:true
    },
    profCpass:{
        type:String,
        required:true
    }
})
const profLogin = new mongoose.model("PROF_LOGIN",prof)
module.exports=profLogin
