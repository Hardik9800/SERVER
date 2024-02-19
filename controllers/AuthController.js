const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService.js');

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await AuthService.login(username, password);
    console.log(token);
    // res.json({ userId: user._id, username, token });
    res.json({ username, token });

  } catch (error) {
    next(error);
  }
});

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    console.log(req.body)
    const { username, password } = req.body;
    await AuthService.register(username, password);
    res.status(201).send('User registered successfully');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
