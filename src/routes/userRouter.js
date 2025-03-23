const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload'); // multer를 사용하는 경우 (이미지 업로드 처리용)



router.get('/mypage', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login'); // 로그인 안 된 경우
    }

    res.render('user/mypage', { user: req.session.user }); // 로그인 된 경우
});

module.exports = router;
