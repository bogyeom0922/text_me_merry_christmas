const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.renderHomePage);

const Wish = require('../models/Wish');

// MongoDB 기반 index 라우트
router.get('/index', async (req, res) => {
  try {
    const wishes = await Wish.find().sort({ createdAt: -1 }); // 최신순 정렬
    res.render('index', { data: wishes });
  } catch (err) {
    console.error('Index DB 오류:', err);
    res.status(500).send('DB Error');
  }
});

// 카드 종류 선택 페이지
router.get('/sendcard', (req, res) => {
    res.render('card/sendcard');
});

router.get('/game_main', (req, res) => res.render('game/game_main'));

router.get('/game', (req, res) => res.render('game/game'));

router.get('/mypage', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login'); // 로그인 안 된 경우
    }
    res.render('user/mypage', { user: req.session.user }); // 로그인 된 경우
});

router.get('/setting', (req, res) => res.render('user/setting'));

module.exports = router;