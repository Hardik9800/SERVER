const express = require('express');
const router = express.Router();
const WebSocketService = require('../services/WebSocketService');
const Message = require('../models/Message');
const AuthService = require('../services/AuthService');

// POST /chat/send
router.post('/send', async (req, res, next) => {
  try {
    const { message, sender } = req.body;

    // Save the message to the database
    const savedMessage = await Message.create({ content: message, sender });

    // Broadcast the message to all connected clients
    WebSocketService.emit('message', savedMessage);

    res.status(201).send('Message sent successfully');
  } catch (error) {
    next(error);
  }
});

// GET /chat/history
router.get('/history', async (req, res, next) => {
  try {
    const history = await Message.find().populate('sender', 'username');
    res.json(history);
  } catch (error) {
    next(error);
  }
});

// POST /chat/leave
router.post('/leave', async (req, res, next) => {
  try {
    const { user } = req.body;

    // Broadcast that the user is leaving
    WebSocketService.emit('userLeft', user);

    res.status(200).send('User left successfully');
  } catch (error) {
    next(error);
  }
});

// Other chat-related routes...

module.exports = router;
