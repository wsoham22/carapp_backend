const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const bcrypt = require('bcryptjs');
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
