const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jwt here
const User = require('../models/User');

async function register(username, password) {

  const user = new User({ username, password});
  await user.save();
}

async function login(username, password) {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = user.comparePassword(password)

    if (!isPasswordValid) {
      console.log('Entered Password:', password);
      console.log('Stored Password:', user.password);
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Login failed');
  }
}


function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.status(403).send('Forbidden');
    req.user = user;
    next();
  });
}

module.exports = { register, login, authenticateToken };
