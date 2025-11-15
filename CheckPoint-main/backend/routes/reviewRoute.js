const router = require("express").Router();
const {
  logGame,
  getGameReview,
  updateGameReview,
  deleteGameReview,
  isGamePlayed,
} = require("../controllers/reviewController");
const verifyUser = require("../middlewares/auth");

router.post("/:id", verifyUser, logGame);
router.get("/isPlayed/:gameId", verifyUser, isGamePlayed);
router.get("/:id", getGameReview);
router.patch("/:id", verifyUser, updateGameReview);
router.delete("/:id", verifyUser, deleteGameReview);

module.exports = router;
