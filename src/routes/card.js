const express = require('express');
const { renderCardPage, handleCreateCard } = require('../controllers/cardController');
const router = express.Router();

router.get('/:type', renderCardPage);
router.post('/:type', handleCreateCard);

module.exports = router;