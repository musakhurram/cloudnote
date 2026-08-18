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
    unique: true,
    lowercase: true, // <-- added: normalizes casing before saving, so
                      // "John@gmail.com" and "john@gmail.com" are always
                      // the same value and the unique index actually
                      // catches the duplicate.
    trim: true        // <-- added: strips accidental leading/trailing
                       // whitespace, another way "duplicate" accounts
                       // sneak past a unique index.
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

module.exports = mongoose.model('user', UserSchema);