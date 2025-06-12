const Wish = require('../models/wish'); // ✅ 모델 이름도 일관되게 Wish

exports.handleCreateWish = async (req, res) => {
	console.log('🧾 req.body:', req.body);

	const { nickname, wish_contents, deco_type } = req.body;

    try {
        const newWish = new Wish({
			nickname, // 익명 이름
			wish_contents, 
			deco_type 
        });

        await newWish.save(); //  여기 변수 이름도 newWish로
        res.redirect('/wish'); // 저장 후 리스트 페이지 등으로 이동
    } catch (error) {
        console.error('소원 저장 오류:', error);
        res.status(500).send('Error saving wish');
    }
};
