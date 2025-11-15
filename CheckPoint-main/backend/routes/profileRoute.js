const express = require("express");
const router = express.Router();
const Profile = require('../models/profile');
const multer = require('multer');
const upload = multer();
const verifyUser = require('../middlewares/auth');

const {handleGetProfile, handleGetProfileByUserId, handleGetUserId} = require('../controllers/profileController');
const { handleUpdateFavs, handleDeleteFav, handleUpdateProfile } = require('../controllers/profileController');

router.route('/')
.get(verifyUser, handleGetProfile)
.patch(verifyUser, upload.single('profileImage'), handleUpdateProfile);

router.route('/fav')
.post(verifyUser,handleUpdateFavs)
.delete(verifyUser, handleDeleteFav);

router.route('/:userId')
.get(handleGetProfileByUserId);

router.route('/user/:id')
.get(handleGetUserId);

module.exports = router;