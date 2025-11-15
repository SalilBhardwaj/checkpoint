const Profile = require("../models/profile");

const { uploadImage } = require("../utils/uploader");
const User = require("../models/user");

const POPULATE_PATHS = [
  "user",
  "favourites.game",
  "lists.list",
  "wishlist.game",
  {
    path: "reviews.review",
    populate: [
      { path: "game", model: "game" },
      { path: "createdBy", model: "user" },
    ],
  },
];

const handleGetProfile = async function (req, res) {
  const user = req.user;
  if (!user) {
    return res
      .status(400)
      .json({ status: 400, message: "Login Again to Continue..." });
  }
  try {
    const userProfile = await Profile.findOne({ user: user._id });
    if (!userProfile) {
      return res
        .status(404)
        .json({ status: 404, message: "Profile not found" });
    }
    await userProfile.populate(POPULATE_PATHS);
    userProfile.reviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    userProfile.wishlist.sort(
      (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
    );
    return res.status(200).json({ profile: userProfile });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: `Error occurred ${e}` });
  }
};

const handleCreateProfile = async function (userId) {
  let userProfile = await Profile.findOne({ user: userId });
  if (userProfile != null) {
    return;
  } else {
    userProfile = await Profile.create({ user: userId });
    await userProfile.populate("user");
    return;
  }
};

const handleUpdateFavs = async function (req, res) {
  const user = req.user;
  const favs = req.body.favs;

  if (!user) {
    return res
      .status(400)
      .json({ status: 400, message: "Login Again to Continue..." });
  }

  // Build the new favourites array in the correct order
  const newFavourites = favs.map((fav) => ({
    game: fav.game ? fav.game._id || fav.game : null,
    addedAt: Date.now(),
  }));

  await Profile.updateOne(
    { user: user._id },
    { $set: { favourites: newFavourites } }
  );

  const updatedProfile = await Profile.findOne({ user: user._id });
  await updatedProfile.populate(POPULATE_PATHS);
  res.status(200).json({ status: 200, Profile: updatedProfile });
};

const handleDeleteFav = async function (req, res) {
  const user = req.user;
  const fav = req.body.favs[0];

  if (!user) {
    return res
      .status(400)
      .json({ status: 400, message: "Login Again to Continue..." });
  }
  await Profile.updateOne(
    { [`favourites.${fav.id}`]: { $exists: true } },
    { $unset: { [`favourites.${fav.id}`]: {} } }
  );
  const userProfile = await Profile.findOne({ user: user._id });
  await userProfile.populate(POPULATE_PATHS);
  return res.status(201).json({ message: "deleted", Profile: userProfile });
};

const handleUpdateProfile = async function (req, res) {
  const user = req.user;
  console.log(req.body);
  console.log(req.file);
  const { name, userName, description } = req.body;
  const profileImage = req.file || req.body.profileImage;
  let imageUrl;
  if (profileImage)
    imageUrl = await uploadImage(
      profileImage.buffer,
      profileImage.name || "image"
    );
  const userData = await User.findById(user._id);
  const profile = await Profile.findOne({ user: user._id });
  const existingUsername = await User.findOne({ userName: userName });
  if (
    existingUsername &&
    existingUsername._id.toString() !== user._id.toString()
  ) {
    return res.status(400).json({ message: "Username already exists" });
  }
  if (!user) {
    return res
      .status(400)
      .json({ status: 400, message: "Login Again to Continue..." });
  }
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }
  if (!userData) {
    return res.status(404).json({ message: "User not found" });
  }
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        name,
        userName,
        profileImage: imageUrl?.secure_url,
      },
    }
  );
  await Profile.updateOne(
    { user: user._id },
    { $set: { description: description } }
  );
  const updatedProfile = await Profile.findOne({ user: user._id });
  await updatedProfile.populate(POPULATE_PATHS);
  return res.status(200).json({
    message: "Profile updated successfully",
    profile: updatedProfile,
    user: {
      name: userData.name,
      userName: userData.userName,
      email: userData.email,
      profileImage: userData.profileImage,
    },
  });
};

const handleGetUserId = async function (req, res) {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  let user;
  try {
    user = await User.findById({ _id: id})
    if(user)
      return res.status(200).json({ userId: user._id });
  }catch (e) {
    console.error(e);
  }
  try{
    user = await User.findOne({ userName: id });
    if(user)
      return res.status(200).json({ userId: user._id });
  }catch (e) {
    console.error(e);
  }
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ userId: user._id });
}

const handleGetProfileByUserId = async function (req, res) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userProfile = await Profile.findOne({ user : userId });
    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    await userProfile.populate(POPULATE_PATHS);
    userProfile.reviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    userProfile.wishlist.sort(
      (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
    );
    return res.status(200).json({ profile: userProfile });
  }catch (e) {
    console.error(e);
    return res.status(500).json({ error: `Error occurred: ${e.message}` });
  }
};

module.exports = {
  handleGetProfile,
  handleCreateProfile,
  handleUpdateFavs,
  handleDeleteFav,
  handleUpdateProfile,
  handleGetProfileByUserId,
  handleGetUserId,
};
