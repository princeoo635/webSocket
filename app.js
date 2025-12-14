const express=require("express")
const path=require("path")
const app=express();
const Port = process.env.Port || 8000;

const server =app.listen(Port,()=>
console.log(`server is running at Port : ${Port}`))

const io=require('socket.io')(server)
app.use(express.static(path.join(__dirname,'public')));

let socketConnected = new Set()
io.on('connection',onConnection)

function onConnection(socket) {
    socketConnected.add(socket.id) 
    io.emit('clients-total',socketConnected.size)
    socket.on('disconnect',()=>{
        socketConnected.delete(socket.id)
        io.emit('clients-total',socketConnected.size)
    })
    socket.on("message",(data)=>{
        socket.broadcast.emit('chatMessage',data)
    })
    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data)
    })
}