const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Game = require("../models/game");

function buildGameFilterQuery(query) {
  const filter = {};
  if (query.genres) filter.genre = { $in: query.genres.split(",") };
  if (query.platforms) filter.platforms = { $in: query.platforms.split(",") };
  if (query.developers)
    filter.developers = { $in: query.developers.split(",") };
  if (query.publishers)
    filter.publishers = { $in: query.publishers.split(",") };
  if (query.yearMin || query.yearMax) {
    filter.released = {};
    if (query.yearMin) filter.released.$gte = `${query.yearMin}-01-01`;
    if (query.yearMax) filter.released.$lte = `${query.yearMax}-12-31`;
  }
  if (query.ratingMin || query.ratingMax) {
    filter.rating = {};
    if (query.ratingMin) filter.rating.$gte = Number(query.ratingMin);
    if (query.ratingMax) filter.rating.$lte = Number(query.ratingMax);
  }

  Object.keys(query).forEach((key) => {
    if (key.startsWith("userStatus_") && query[key] === "true") {
      filter[`userStatus.${key.replace("userStatus_", "")}`] = true;
    }
  });
  return filter;
}

router.get("/latest", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);
    const filter = buildGameFilterQuery(req.query);
    if (!filter.released) filter.released = {};
    filter.released.$lt = todayStr;
    const games = await Game.find(filter)
      .sort({ released: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalPages = Math.ceil((await Game.countDocuments(filter)) / limit);
    res.json({ games: games, totalPages: totalPages });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get("/upcoming", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);
    const filter = buildGameFilterQuery(req.query);
    if (!filter.released) filter.released = {};
    filter.released.$gt = todayStr;
    const games = await Game.find(filter)
      .sort({ released: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalPages = Math.ceil((await Game.countDocuments(filter)) / limit);
    res.json({ games: games, totalPages: totalPages });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get("/top-rated", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  try {
    const filter = buildGameFilterQuery(req.query);
    const games = await Game.find(filter)
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalPages = Math.ceil((await Game.countDocuments(filter)) / limit);
    res.json({ games: games, totalPages: totalPages });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get("/popular", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  try {
    const filter = buildGameFilterQuery(req.query);
    const games = await Game.find(filter)
      .sort({ _id: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalPages = Math.ceil((await Game.countDocuments(filter)) / limit);
    res.json({ games: games, totalPages: totalPages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const gameId = new mongoose.Types.ObjectId(req.params.id);
  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.json({ error: "game not found!!" });
    }
    res.json({ game: game });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get("/:id/reviews", async (req, res) => {
  const gameId = new mongoose.Types.ObjectId(req.params.id);
  try {
    const game = await Game.findById(gameId).populate({
      path: "reviews",
      populate: {
        path: "createdBy",
        select: "userName name profileImage email",
      },
    });
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json({ reviews: game.reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
