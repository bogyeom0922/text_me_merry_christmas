const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { ensureLogin } = require('../middlewares/authMiddleware');
const Wish = require('../models/wish');

// ✅ index.ejs 렌더링 (로그인 여부는 뷰에서 처리)
router.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.render('user/login', {
      layout: false,
      is_logined: false,
      user: null
    });
  }

  try {
    const wishes = await Wish.find().sort({ createdAt: -1 });
    res.render('index', {
      data: wishes,
      is_logined: true,
      user: req.session.user
    });
  } catch (err) {
    console.error('Index DB 오류:', err);
    res.status(500).send('DB Error');
  }
});

// ✅ 카드 종류 선택 페이지
router.get('/sendcard', (req, res) => {
  res.render('card/sendcard');
});

// 게임 페이지
router.get('/game_main', (req, res) => res.render('game/game_main'));
router.get('/game', (req, res) => res.render('game/game'));

// 마이페이지 (로그인 필요)
router.get('/mypage', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/kakao'); // 또는 /user/login
  }
  res.render('user/mypage', { user: req.session.user });
});

// 설정 페이지
router.get('/setting', (req, res) => res.render('user/setting'));

module.exports = router;
