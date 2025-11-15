const express = require("express");
const verifyUser = require("../middlewares/auth");
const router = express.Router();

const {
  handleGetWishlist,
  handleAddToWishlist,
  handleRemoveFromWishlist,
  handleIsWishlisted,
} = require("../controllers/wishlistController");

router.get("/", verifyUser, handleGetWishlist);
router.get("/isWishlisted/:gameId", verifyUser, handleIsWishlisted);

router.patch("/add", verifyUser, handleAddToWishlist);
router.patch("/remove", verifyUser, handleRemoveFromWishlist);

module.exports = router;
