const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    passwordResetToken: {
      type:String,
    },
    passwordResetExpires: {
      type:Date,
    },
    followers: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' 
    }],
    following: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' 
    }], 
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
