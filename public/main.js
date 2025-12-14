const socket=io()
dayjs.extend(dayjs_plugin_relativeTime)

const clientsTotal=document.getElementById('clients-total')
const messageContainer=document.getElementById('message-container')
const messageForm=document.getElementById('message-form')
const messageInput=document.getElementById('message-input')
const nameInput=document.getElementById('name-input')
const feedback=document.getElementById('feedback')

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendMessage()
})
socket.on('clients-total',(data)=>{
    clientsTotal.innerText=`Total Clients : ${data}`
})

function sendMessage(){
    const data={
        name:nameInput.value,
        message:messageInput.value,
        dateTime:new Date()
    }
    socket.emit('message',data)
    addMessage(true,data)
    messageInput.value=''
}
socket.on('chatMessage',(data)=>{
    addMessage(false,data)
})
function addMessage(isOwnMessage,data){
    clearFeedback()
    let element=`<li class="${isOwnMessage?"message-right":"message-left"}">
    <p class="message">${data.message}
    <span>${data.name}.${dayjs(data.dateTime).fromNow()}</span>
    </p>
    </li>`
    messageContainer.innerHTML+=element; 
    scrollToBottom()      
}

function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
socket.emit('feedback',{
    feedback:`${nameInput.value} is typing a message...`
 })
})
messageInput.addEventListener('blur',(e)=>{
 socket.emit('feedback',{
    feedback: ''
 })
}) 
messageInput.addEventListener('keypress',(e)=>{
 socket.emit('feedback',{
    feedback:`${nameInput.value} is typing a message...`
 })
}) 
socket.on('feedback',(data)=>{
    clearFeedback()
const element=` <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
            </li>`
    messageContainer.innerHTML+=element
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    });
}