const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
   email: {
    type: String,
    required: true,
    unique: true
  },
   password: {
    type: String,
    // Not required — Google sign-in users have no password.
    default: null
  },
   picture: {
    type: String,
    default: null
  },
   googleId: {
    type: String,
    default: null
  },
   date: {
    type: Date,
    default: Date.now
  }
});

const user = mongoose.model('user', UserSchema);
module.exports = user;
