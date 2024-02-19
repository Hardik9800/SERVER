const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authMiddleware = require('./services/AuthService');

Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization

var cors = require('cors')

dotenv.config();

const databaseUrl = 'mongodb+srv://hardikgupta7500:hardik19@cluster0.kl1iqow.mongodb.net/database_name';


mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});


const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(express.urlencoded());




const io = socketIO(server, {
  cors: {
    origin: 'https://hardik9800.github.io/CHATAPP-CLIENT/',
    methods: ['GET', 'POST'],
  },
});

// Use WebSocketService to handle WebSocket connections
//io.on('connection', WebSocketService);

// Apply authentication middleware to specific routes
app.use('/chat', authMiddleware.authenticateToken);

// Set up your routes
const authRouter = require('./controllers/AuthController');
const chatRouter = require('./controllers/ChatController');

app.use('/auth', authRouter);
app.use('/chat', chatRouter);

chatSockets  =(socketServer)=>{
  let io = require('socket.io')(socketServer ,{
      cors:{
          origin:"*"
      }
  });

  io.sockets.on('connection', function(socket){
      console.log('new connection received', socket.id);

      socket.on('disconnect', function(){
          console.log('socket disconnected!');
      });
      socket.on('join_room', function(data){
          console.log('joining request rec.', data);

          socket.join(data.chatroom);

          io.in(data.chatroom).emit('user_joined', data);
      })

       // CHANGE :: detect send_message and broadcast to everyone in the room
       socket.on('send_message', function(data){
          io.in(data.chatroom).emit('receive_message', data);
          });

  });

}

module.exports = io;

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
