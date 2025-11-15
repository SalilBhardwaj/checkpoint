const Profile = require("../models/profile");
const User = require("../models/user");
const List = require("../models/list");

const { uploadImage } = require("../utils/uploader");

const handleGetListById = async function (req, res) {
  const user = req.user;
  const listId = req.params.id;
  const list = await List.findById(listId).populate([
    "createdBy",
    "listItems.game",
  ]);
  return res.status(200).json({ list: list });
};

const handleGetLists = async function (req, res) {
  const list = await List.find()
    .populate(["createdBy", "listItems.game"])
    .sort({ createdBy: -1 });
  // console.log(list);
  return res.status(200).json({ list: list });
};

const handleCreateList = async function (req, res) {
  const user = req.user;
  const { title, tags, description, whoCanView } = req.body;
  const tagsArr = tags.split(",");

  try {
    const image = req.file;
    let imageUrl;
    if (image)
      imageUrl = await uploadImage(image.buffer, image.name || "image");

    const list = await List.create({
      title,
      tags: tagsArr,
      coverImage: imageUrl?.secure_url,
      createdBy: user._id,
      description,
      whoCanView,
    });

    // Update user's profile to add this list
    await Profile.updateOne(
      { user: user._id },
      { $push: { lists: { list: list._id } } }
    );

    await list.populate("createdBy");
    const lists = await List.find().populate(["createdBy", "listItems"]);
    return res.status(200).json({ list: list });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Some Error Occurred." });
  }
};

const handleUpdateList = async function (req, res) {
  const user = req.user;
  listId = req.params.id;
  const listDetails = req.body.listDetails;
  const list = await List.findById(listId);
  if (!list) {
    res.status(404).json({ error: "List Not Found" });
  }
  list.title = listDetails.title;
  list.description = listDetails.description;
  list.whoCanView = listDetails.whoCanView;
  list.tags = listDetails.tags;
  list.updatedAt = Date.now();
  await list.save();
  await list.populate("createdBy");
  await list.populate("listItems.game");
  return res.status(200).json({ list: list });
};

const handleDeleteList = async function (req, res) {
  const user = req.user;
  const listId = req.params.id;
  //   console.log(listId);
  const list = await List.findById(listId);
  //   console.log(list);
  if (!list) {
    return res.status(404).json({ error: "List Not Found" });
  }
  if (list.createdBy.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({ error: "You are not allowed to delete this list" });
  }
  await List.findByIdAndDelete(listId);
  //   console.log("deleted");
  await Profile.updateMany(
    { "lists.list": listId },
    { $pull: { lists: { list: listId } } }
  );

  return res.status(200).json({ message: "List Deleted Successfully" });
};

const handleAddToList = async function (req, res) {
  const user = req.user;
  const listId = req.params.id;
  const list = await List.findById(listId);
  const games = req.body.gameIds;
  console.log(games);
  games.forEach((game) => {
    const gameId = game.toString();

    const alreadyInList = list.listItems.find(
      (item) => item.game.toString() === gameId
    );

    if (!alreadyInList && gameId !== "") {
      //   console.log("pushing");
      list.listItems.push({
        game: game,
        addedAt: Date.now(),
      });
    }
  });

  list.updatedAt = Date.now();
  await list.save();
  await list.populate(["createdBy", "listItems.game"]);
  console.log(list);
  return res.status(200).json({ list: list });
};

const handleRemoveFromList = async function (req, res) {
  const user = req.user;
  const listId = req.params.id;
  console.log(listId);
  try {
    const list = await List.findById(listId);
    const game = req.body.game;
    list.listItems.pull(
      list.listItems.find((item) => item.game._id.toString() == game.toString())
    );
    list.updatedAt = Date.now();
    await list.save();
    await list.populate(["createdBy", "listItems.game"]);
    return res.status(200).json({ list: list });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "List Not Found" });
  }
};

module.exports = {
  handleGetLists,
  handleGetListById,
  handleCreateList,
  handleUpdateList,
  handleDeleteList,
  handleAddToList,
  handleRemoveFromList,
};
