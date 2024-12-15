import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');

// Starts an authenticated session by regenerating the session
const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user; 
        fulfill(user);
      } else {
        reject(err);
      }
    });
  });
};

// Ends the session by destroying it
const endAuthenticatedSession = (req) => {
  return new Promise((fulfill, reject) => {
    req.session.destroy((err) => (err ? reject(err) : fulfill(null)));
  });
};

// Registers a new user after validating inputs
const register = async (username, email, password) => {
  if (username.length <= 8 || password.length <= 8) {
    throw { message: 'USERNAME PASSWORD TOO SHORT' };
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw { message: 'USERNAME ALREADY EXISTS' };
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    trips: []
  });

  await newUser.save();
  return newUser;
};

// Logs in a user after verifying credentials
const login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw { message: 'USER NOT FOUND' };
  }
  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    throw { message: 'PASSWORDS DO NOT MATCH' };
  }
  console.log(`user ${username} logged in`);
  return user;
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login
};
