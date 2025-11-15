const dotenv = require("dotenv");
dotenv.config(); // Make sure this is FIRST before anything using env vars

const mongoose = require("mongoose");
const axios = require("axios");
const Game = require("./models/game");


const databaseConnect = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch((err) => {
      console.log("Error Connecting to Database" + err);
    });
};

const BASE_URL = `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&ordering=-released&page_size=40`;

const fetchAndUpdate = async (pages = 5) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected Successfully By Cron");

    for (let i = 1; i <= pages; i++) {
      const { data } = await axios.get(`${BASE_URL}&page=${i}`);
      
      for (const game of data.results) {
        const gameData = {
          id: game.id,
          title: game.name,
          released: game.released,
          rating: game.rating,
          playTime: game.playtime,
          genres: game.genres.map((g) => g.name),
          platforms: game.platforms?.map((p) => p.platform.name),
          coverImage: game.background_image,
        };

        const existingGame = await Game.findOne({ id: game.id });
        if (!existingGame) {
          await Game.create(gameData);
        }
      }
    }

  } catch (err) {
    console.error("Error during fetch and update:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Database Disconnected");
  }
};


if (require.main == module) {
  fetchAndUpdate(10);
}

module.exports = { databaseConnect, fetchAndUpdate };
