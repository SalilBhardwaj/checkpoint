const router = require("express").Router();
const Game = require("../models/game");

router.get("/", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "nothing search" });

  try {
    const games = await Game.aggregate([
      {
        $search: {
          index: "gameSearchIndex",
          text: {
            query: q,
            path: ["title", "genre", "developers"],
            fuzzy: {},
          },
        },
      },
      { $limit: 20 },
      {
        $project: {
          title: 1,
          genre: 1,
          developers: 1,
          rating: 1,
          released: 1,
          coverImage: 1,
          score: { $meta: "searchScore" },
        },
      },
      { $sort: { score: -1 } },
    ]);
    res.json({games : games});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
