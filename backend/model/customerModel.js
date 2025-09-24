const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId; // Password required only if not Google OAuth user
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    mobileNumber: {
      type: String,
      required: function() {
        return !this.googleId; // Mobile required only if not Google OAuth user
      },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: function() {
        return !this.googleId; // Gender required only if not Google OAuth user
      },
    },
    age: {
      type: Number,
      required: function() {
        return !this.googleId; // Age required only if not Google OAuth user
      },
    },
    address: {
      type: String,
      required: function() {
        return !this.googleId; // Address required only if not Google OAuth user
      },
    },
    profilePicture: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Customer', customerSchema);
