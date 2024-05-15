const mongoose=require("mongoose")
const hod =  mongoose.Schema({
    hodEmail:{
        type:String,
        required:true
    },
    hodfpass:{
        type:String,
        required:true
    }
})
const hodLogin = new mongoose.model("HOD_LOGIN",hod)
module.exports=hodLogin