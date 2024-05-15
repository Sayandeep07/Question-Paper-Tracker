const mongo=require("mongoose")
mongo.connect("mongodb://localhost:27017/question_tracker").then(()=>{
    console.log("connection successful")
}).catch(
    (e)=>{
        console.log(e)
    }
)