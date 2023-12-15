const express = require('express');
const io = require('socket.io')({
    path: '/webrtc',    // this is like an API endpoint, it is the path where the socket will be listening for requests. Normally, we would have just one path in a simple setup
    cors: {
        origin: "https://localhost:5000", //doesn't cover for 127.0.0.1
        methods: ["GET", "POST"]
    }
});

const app = express();
// const cors = require('cors');
const port = 8080;

// app.use(cors(
//     {
//         origin: 'https://localhost:5000',   // this is the origin of the request, the frontend
//     }
// ));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const start = () => {
    const server = app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
    io.listen(server);
    
    const webRTCNamespace = io.of('/webRTCPeers');  // this is like a channel or a room where multiple users can have a private chat, there can be multiple namespaces
    webRTCNamespace.on('connection', socket => {

        socket.emit('connection-success', { 
            socketID: socket.id,
            status: 'connection-success',
        });
        
        console.log('a user connected', socket.id);
        
        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
        });
        
        socket.on('sdp', data => {
            console.log('sdp offer received', data);
            socket.broadcast.emit('sdp', data);
        });
        
        // socket.on('answer', answer => {
        //     console.log('answer received');
        //     socket.broadcast.emit('answer', answer);
        // });
        
        // socket.on('iceCandidate', iceCandidate => {
        //     console.log('ice candidate received');
        //     socket.broadcast.emit('iceCandidate', iceCandidate);
        // });
    });
};

start();