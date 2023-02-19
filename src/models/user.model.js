const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    require: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Please provide a password'],
    minLength: false,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password '],
    validate: {
      // THIS ONLY WORK FOR CREATE AND SAVE!!! (managing password always using SAVE)
      validator: function (el) {
        return el === this.password; // abc === abc
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // Only run if the password was actually modified
  if (!this.isModified('password')) return next();
  // Hash our password (encrypt password) with the cost of tour
  this.password = await bcrypt.hash(this.password, 12);
  // Delete field password confirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
