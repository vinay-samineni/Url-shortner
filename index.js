const express=require("express")
const path=require("path")
const {router:urlRoute} =require("./routes/url");
const {connectToMongoDB} =require("./connect");
const staticRoute = require('./routes/staticRouter')
const URL =require('./models/url')
connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=> console.log("mongoDB connected"));

const app= express();
const PORT=8002;
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/url",urlRoute);
app.use("/",staticRoute);

app.get('/api/:shortId',async(req,res)=>{
    const shortId =req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId
    },{ $push:
        {
            visitHistory:{
                timestamp:Date.now(),}, 
        },
    });
    res.redirect(entry.redirectURL)
})



app.listen(PORT,()=>console.log("apllication running on port no :  ",PORT));