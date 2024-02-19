const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Set an appropriate minimum password length
  },
  // Add other user-related fields as needed
});

// Hash the user's password before saving it to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    const saltRounds = 10; // You can adjust the salt rounds based on your security requirements
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  next();
});

// Method to compare a given password with the hashed password stored in the database
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
