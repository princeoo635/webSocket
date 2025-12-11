const express=require("express")
const path=require("path")
const app=express();
const Port = process.env.Port || 8000;

const server =app.listen(Port,()=>
console.log(`server is running at Port : ${Port}`))

app.use(express.static(path.join(__dirname,'public')));
