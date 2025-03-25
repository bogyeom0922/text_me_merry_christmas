const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// 카드 작성 (ex: /card/1)
router.get('/:type', cardController.renderCardPage);
router.post('/:type', cardController.handleCreateCard);

// 카드 목록 보기
router.get('/list/all', cardController.listCards); // 주소를 /list/all 로 변경 (중복 방지용)

// 카드 상세 보기
router.get('/view/:from_name', cardController.viewCard);

// 카드 수정
router.post('/view/:from_name', cardController.updateCard);

module.exports = router;