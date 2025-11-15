const User = require("../models/user");
const List = require("../models/list");
const Review = require("../models/review");

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(req.user);
    console.log(userId); // ID of the logged-in user
    const targetUserId = req.params.id; // ID of the user to follow

    if (userId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself." });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    if (user.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Already following" });
    }

    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.params.id;

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    user.following = user.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get followers list
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "name userName"
    );
    res.json({ followers: user.followers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get following list
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "name userName"
    );
    res.json({ following: user.following });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.handleGetLists = async function (req, res) {
  const user = req.user;
  const userId = req.params.id;
  const list = await List.find({ createdBy: userId })
    .populate(["createdBy", "listItems.game"])
    .sort({ createdBy: -1 });
  if (!list) {
    return res.status(404).json({ error: "List Not Found" });
  }
  return res.status(200).json({ lists: list });
};

exports.handleGetReviews = async function (req, res) {
  const user = req.user;
  const userId = req.params.id;
  const reviews = await Review.find({ createdBy: userId })
    .populate("game")
    .populate("createdBy")
    .sort({ createdAt: -1 });

  if (!reviews) {
    return res.status(404).json({ error: "Reviews Not Found" });
  }

  return res.status(200).json({ reviews });
};

exports.handleGetFavoriteGenre = async function (req, res) {
  const user = req.user;
  const userId = req.params.id;
  const reviews = await Review.find({ createdBy: userId }).populate("game");
  let hashMap = {};
  for (let review of reviews) {
    const game = review.game;
    game?.genre.map((e) => {
      if (hashMap[e] === undefined) {
        hashMap[e] = 1;
      } else {
        hashMap[e]++;
      }
    });
  }
  const favGenres = Object.entries(hashMap)
  .sort((a, b) => b[1] - a[1]) // Sort descending by frequency
  .map(([key, value]) => key); 
  if(favGenres.length > 0){
    return res.status(200).json({favGenres: favGenres});
  }
  return res.status(204).json({message: "No Games Played"});
};
