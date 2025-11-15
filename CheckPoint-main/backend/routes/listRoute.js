const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const verifyUser = require('../middlewares/auth');

const { handleGetLists, handleCreateList, handleUpdateList, handleDeleteList, handleGetListById } = require('../controllers/listController');
const { handleAddToList, handleRemoveFromList } = require('../controllers/listController');

router.post('/create', verifyUser, upload.single('coverImage'), handleCreateList);
router.get('/', handleGetLists);

router.route('/:id')
    .get(verifyUser, handleGetListById)
    .patch(verifyUser, handleUpdateList)
    .delete(verifyUser, handleDeleteList);

router.patch('/:id/add', verifyUser, handleAddToList);
router.patch('/:id/remove', verifyUser, handleRemoveFromList);

module.exports = router;