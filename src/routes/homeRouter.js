const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const Wish = require('../models/Wish');


router.get('/', async (req, res) => {
  try {
    const data = await Wish.find();
    res.render('index', {
      data,
      is_logined: req.session.user ? true : false,
      user: req.session.user || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error rendering home page');
  }
});

router.get('/game_main', (req, res) => res.render('game/game_main'));

router.get('/game', (req, res) => res.render('game/game'));

router.get('/mypage', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login'); // 로그인 안 된 경우
    }
    res.render('user/mypage', { user: req.session.user }); // 로그인 된 경우
});

module.exports = router;