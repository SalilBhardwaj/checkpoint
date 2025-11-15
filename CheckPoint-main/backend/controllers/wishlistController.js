const Profile = require("../models/profile");

const handleGetWishlist = async function (req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Login to Continue" });
  }
  try {
    const userProfile = await Profile.findOne({ user: user._id }).populate([
      "user",
      "wishlist.game",
    ]);
    return res.status(200).json({ wishlist: userProfile.wishlist });
  } catch (e) {
    return res.json({ error: `Error Occurred ${e}` });
  }
};

const handleIsWishlisted = async function (req, res) {
  const user = req.user;
  const gameId = req.params.gameId;

  if (!user) {
    return res.status(401).json({ error: "Login to Continue" });
  }

  try {
    const userProfile = await Profile.findOne({ user: user._id });
    if (!userProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const isWishlisted = userProfile.wishlist.some(
      (item) => item.game.toString() === gameId
    );

    return res.status(200).json({ isWishlisted });
  } catch (e) {
    return res.status(500).json({ error: `Error Occurred ${e}` });
  }
};

const handleAddToWishlist = async (req, res) => {
  const user = req.user;
  const gameId = req.body.gameId;
  if (!user) {
    return res.status(401).json({ error: "Login to Continue" });
  }
  try {
    const userProfile = await Profile.findOne({ user: user._id });

    const alreadyInList = userProfile.wishlist.some(
      (item) => item.game._id.toString() === gameId.toString()
    );

    if (!alreadyInList && gameId !== "") {
      console.log("pushing");
      userProfile.wishlist.push({
        game: gameId,
        addedAt: Date.now(),
      });
    }
    await userProfile.save();
    await userProfile.populate(["user", "wishlist.game"]);
    return res.status(200).json({ wishlist: userProfile.wishlist });
  } catch (e) {
    res.json({ error: `Error Occurred ${e}` });
  }
};

const handleRemoveFromWishlist = async function (req, res) {
  const user = req.user;
  const gameId = req.body.gameId;
  if (!user) {
    return res.status(401).json({ error: "Login to Continue" });
  }
  try {
    const userProfile = await Profile.findOne({ user: user._id });
    const itemIndex = userProfile.wishlist.findIndex(
      (item) => item.game.toString() === gameId.toString()
    );

    if (itemIndex !== -1) {
      userProfile.wishlist.splice(itemIndex, 1);
      await userProfile.save();
    }

    await userProfile.populate(["user", "wishlist.game"]);
    return res.status(200).json({ wishlist: userProfile.wishlist });
  } catch (e) {
    console.error("Error removing from wishlist:", e);
    res.status(500).json({ error: `Error Occurred ${e}` });
  }
};

module.exports = {
  handleGetWishlist,
  handleAddToWishlist,
  handleRemoveFromWishlist,
  handleIsWishlisted,
};
