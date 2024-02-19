const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const WebSocketService = require('./services/WebSocketService');
const authMiddleware = require('./services/AuthService');

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


app.use(cors())
const io = socketIO(server, {
  cors: {
    origin: 'https://hardik9800.github.io/',
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


io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user joining
  socket.on('join', (user) => {
    console.log('User joined:', user);
    io.emit('userJoined', user);
  });

  // Handle incoming messages
  socket.on('message', (data) => {
    console.log('Received message:', data);
    io.emit('message', data);
  });

  // Handle user leaving
  socket.on('leave', (user) => {
    console.log('User left:', user);
    io.emit('userLeft', user);
  });

  // Handle typing indicators
  socket.on('typing', (user) => {
    console.log('User is typing:', user);
    io.emit('userTyping', user);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

module.exports = io;

// Other middleware and error handling...

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
