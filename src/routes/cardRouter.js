const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.get('/', cardController.renderCardMenu);
router.get('/new', cardController.renderCreatePage);
router.post('/', cardController.handleCreateCard);
router.get('/sentList', cardController.renderSentCardList);
router.get('/receivedList', cardController.renderReceivedCardList);
router.get('/detail/:id', cardController.renderCardDetail);

module.exports = router;