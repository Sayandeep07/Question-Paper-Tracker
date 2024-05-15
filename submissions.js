const mongoose=require("mongoose")
const submission =  mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    Prof_name:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    subCode:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    questionPaper:{
        type:String,
        required:true
    }
})
const submit = new mongoose.model("submissions",submission)
module.exports=submit