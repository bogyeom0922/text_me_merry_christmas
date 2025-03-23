const Card = require('../models/card');

// 카드 작성 페이지 렌더링
exports.renderCardPage = (req, res) => {
    const { type } = req.params;
    res.render(`card${type}`);
};

// 카드 생성 처리
exports.handleCreateCard = async (req, res) => {
    const { from_name, to_name, content } = req.body;
    const cardType = req.params.type;

    try {
        const newCard = new Card({
            from_name,
            to_name,
            content,
            card_type: cardType
        });

        await newCard.save(); // MongoDB에 저장
        res.redirect('/index');
    } catch (error) {
        console.error('카드 생성 오류:', error);
        res.status(500).send('Error creating card');
    }
};
