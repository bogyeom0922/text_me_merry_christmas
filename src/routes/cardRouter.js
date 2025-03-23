// src/routes/cardRouter.js

const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// 카드 작성 페이지 렌더링 (ex: /card/1, /card/2 등)
router.get('/:type', cardController.renderCardPage);

// 카드 생성 요청 처리 (POST)
router.post('/:type', cardController.handleCreateCard);

module.exports = router;
