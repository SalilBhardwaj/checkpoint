const express = require("express");
const router = express.Router();
const { signup, signin } = require("../controllers/authController");
const { logout } = require("../controllers/authController");
const verifyUser = require("../middlewares/auth");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  handleGetFavoriteGenre,
} = require("../controllers/userController");
const {
  handleGetLists,
  handleGetReviews,
} = require("../controllers/userController");
router.post("/signup", signup);

router.post("/signin", signin);

// router.get("/profile", verifyUser, async (req, res) => {
//   try {
//     res.status(200).json(req.user);
//    //  console.log(req.user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }); //profile controller

router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/follow/:id", verifyUser, followUser);
router.post("/unfollow/:id", verifyUser, unfollowUser);
router.get("/followers/:id", verifyUser, getFollowers);
router.get("/following/:id", verifyUser, getFollowing);
router.get("/lists/:id", verifyUser, handleGetLists);
router.get("/reviews/:id", verifyUser, handleGetReviews);
router.get("/favGenres/:id", verifyUser, handleGetFavoriteGenre);

module.exports = router;
