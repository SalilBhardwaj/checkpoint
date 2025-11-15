const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  description: { type: String, default: "CheckPoint User" },
  favourites: [
    {
      game: { type: mongoose.Schema.Types.ObjectId, ref: "game" },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  wishlist: [
    {
      game: { type: mongoose.Schema.Types.ObjectId, ref: "game" },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  lists: [
    {
      list: { type: mongoose.Schema.Types.ObjectId, ref: "list" },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  reviews: [
    {
      review: { type: mongoose.Schema.Types.ObjectId, ref: "review", required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

const Profile = mongoose.model("profile", profileSchema);
module.exports = Profile;
