const express=require("express")
const web=express()
const port=process.env.PORT || 3000
const hbs=require("hbs")
const path=require("path")
const views_path=path.join(__dirname,"../template/views")
const body_parser=require("body-parser")
require("./db/connection")
const hodLogin=require("./models/HODSchema")
const profLogin = require("./models/professorSchema");
const submit=require("./models/submissions")

web.use(body_parser.json())
web.use(body_parser.urlencoded({extended:false}))

web.use("/image",express.static(path.join(__dirname,"../template/public/assets/image")))


web.set("view engine","hbs")
web.set("views",views_path)

web.listen(port,()=>{
    console.log(`app running in port: ${port}`)
    console.log(views_path);
})

web.get("/home",(req,res) =>{
    res.render("HOME")
} )
web.get("/proflogin",(req,res) =>{
    res.render("ProfLogin")
} )

web.get("/hodlogin",(req,res) =>{
    res.render("HODLogin")
} )

web.get("/newhod",(req,res) =>{
    res.render("newHOD")
} )

web.get("/papersubmit",(req,res)=>{
    res.render("paper_submission")
})

web.post("/proflogin", async (req, res) => {
    try {
        const { profID, profpass } = req.body;
        const user = await profLogin.findOne({ profID: profID });
        if (!user) {
            return res.send('<script>alert("User not found"); window.location="/proflogin";</script>');
        }
        if (user.profpass !== profpass) {
            return res.send('<script>alert("Incorrect password"); window.location="/proflogin";</script>');
        }
        res.redirect("/papersubmit");
    } catch (error) {
        console.error('Error while logging in:', error);
        res.status(500).send("Error while logging in");
    }
});

web.post("/save",async (req,res)=>{
    try {
        const submitData = new submit({
            title: req.body.title,
            Prof_name: req.body.Prof_name,
            subject: req.body.subject,
            subCode: req.body.subCode,
            date: req.body.date,
            questionPaper: req.body.questionPaper
        })
        const data = await submitData.save()
        res.send('<script>alert("Submission successful!"); window.location="/home";</script>');
    }
    catch (e){
        console.error(e);
        res.status(500).send("Internal Server Error");
    }

})
web.get("/hodHome",(req,res)=>{
    res.render("HODhome")
})

web.post("/hodSave", async (req, res) => {
    try {
        const existingUser = await hodLogin.findOne({ hodEmail: req.body.hodEmail });
        if (existingUser) {
            return res.send('<script>alert("User already exists with the same email!"); window.location="/newhod";</script>');
        }
        const userData = new hodLogin({
            hodEmail: req.body.hodEmail,
            hodfpass: req.body.hodfpass
        });
        const data = await userData.save();
        res.send('<script>alert("Registration successful!"); window.location="/hodlogin";</script>');

    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

web.post("/hodlogin", async (req, res) => {
    try {
        const { hodEmail, hodfpass } = req.body;
        const user = await hodLogin.findOne({ hodEmail: hodEmail });
        if (!user) {
            return res.send('<script>alert("User not found"); window.location="/hodlogin";</script>');

        }
        if (user.hodfpass !== hodfpass) {
            return res.send('<script>alert("Incorrect password"); window.location="/hodlogin";</script>');
        }
        res.redirect("/hodHome");
    } catch (error) {
        console.error('Error while logging in:', error);
        res.status(500).send("Error while logging in");
    }
});

web.get("/profreg",(req,res)=>{
    res.render("profREG")
})

web.post("/profSave",async(req,res)=>{
    try{
        const existingEmail = await profLogin.findOne({ profEmail: req.body.profEmail });
        const existingID = await profLogin.findOne({ profID: req.body.profID });

        if (existingEmail) {
            return res.send('<script>alert("User already exists with the same Email!"); window.location="/profreg";</script>');
        }
        if (existingID) {
            return res.send('<script>alert("User already exists with the same Employee ID!"); window.location="/profreg";</script>');
        }
        const userData=new profLogin({
            profName:req.body.profName,
            profEmail:req.body.profEmail,
            profID:req.body.profID,
            profGender:req.body.profGender,
            profSub:req.body.profSub,
            profpass:req.body.profpass,
            profCpass:req.body.profCpass

        })
        const data=await userData.save()
        res.send('<script>alert("Registration successful!"); window.location="/hodHome";</script>');
    }
    catch (e){
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
})


web.get("/hodPanel",(req,res)=>{
    res.render("HODpanel")
})


web.get("/panel", async (req, res) => {
    try {
        const submissions = await submit.find();
        if (submissions && submissions.length > 0) {
            res.status(200).render("HODpanel", { submissions: submissions });
        } else {
            res.status(404).send("No submissions found in the database");
        }
    } catch (error) {
        console.error("Error retrieving submissions:", error);
        res.status(500).send("Internal Server Error");
    }
});

web.post("/panel", async (req, res) => {
    try {
        const submissionId = req.body.id;
        console.log(submissionId);
        const deletedSubmission = await submit.findByIdAndDelete(submissionId);
        if (!deletedSubmission) {
            // return res.status(404).send("Submission not found");
            return res.send('<script>alert("Submission not found"); window.location="/panel";</script>');

        }
        res.redirect("/panel")
    } catch (error) {
        console.error("Error deleting submission:", error);
        res.status(500).send("Internal Server Error");
    }
});


web.get("/regpanel",(req,res)=>{
    res.render("registered")
})

web.get("/reg", async (req, res) => {
    try {
        const submissions = await profLogin.find();
        if (submissions && submissions.length > 0) {
            res.status(200).render("registered", { submit: submissions });
        } else {
            res.status(404).send("No registrations found in the database");
        }
    } catch (error) {
        console.error("Error retrieving submissions:", error);
        res.status(500).send("Internal Server Error");
    }
});

web.post("/reg", async (req, res) => {
    try {
        const submitId = req.body.id;
        console.log(submitId);
        const deletedSubmit = await profLogin.findByIdAndDelete(submitId);
        if (!deletedSubmit) {
            return res.send('<script>alert("Submission not found"); window.location="/reg";</script>');

        }
        res.redirect("/reg")
    } catch (error) {
        console.error("Error deleting submission:", error);
        res.status(500).send("Internal Server Error");
    }
});
