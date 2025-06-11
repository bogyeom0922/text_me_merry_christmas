const Wish = require('../models/wish');
console.log('✅ Wish 모델 로드:', Wish);

exports.renderHomePage = async (req, res) => {
    try {

        const data = await Wish.find().sort({ createdAt: -1 }); // 최신순 정렬
        res.render('user/login', {
            data,
            is_logined: req.session.user ? true : false,
            user: req.session.user || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error rendering home page');
    }
};
