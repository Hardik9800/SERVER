const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Routes
const authRouter = require('./controllers/AuthController');
const chatRouter = require('./controllers/ChatController');

app.use('/auth', authRouter);
app.use('/chat', chatRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;
