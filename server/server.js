const io = require('socket.io')(5175, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

io.on("connection", socket => {
    console.log('conected')
    socket.on('get-document', documentId => {
        const data = '';
        socket.join(documentId)
        socket.emit("load-document", data)

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })
    })

})