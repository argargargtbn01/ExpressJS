const express = require("express");
const userRouter = require("./routes/User");
var bodyParser = require('body-parser')
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/static', express.static('image'))

app.get("/",(req,res)=>{
    res.send("Hello world!!");
})

app.use("/users",userRouter)

app.listen(PORT,()=>{
    console.log(`Example app listening on port ${PORT}`)
})