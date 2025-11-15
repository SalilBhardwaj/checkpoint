const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    tags: {
      type: [String],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    listItems: [
      {
        game: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "game",
          required: true,
        },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    whoCanView: {
      type: String,
      enum: ["public", "private", "friends"],
      default: "public",
      required: true,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const List = mongoose.model("list", listSchema);
module.exports = List;
