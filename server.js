const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

let messages = [] // array que armazena as mensagens

// toda vez que um cliente se conectar no socket, recebe o id do mesmo
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)

    // envia mensagem para o socket unico, nao usa o broadcast, e envia todas as mensagens anteriores
    socket.emit('previousMessages', messages)

    // recebe o evento do front e faz a tratativa
    socket.on('sendMessage', data => {
        messages.push(data)
        socket.broadcast.emit('receivedMessage', data) // envia para tds os sockets conectados na app
    })
})

server.listen(3000)