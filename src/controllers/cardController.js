const Card = require('../models/card');

// 카드 작성 페이지 렌더링
exports.renderCardPage = (req, res) => {
    const { type } = req.params;
    res.render(`card/card${type}`);
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

        await newCard.save();
        res.redirect('/index');
    } catch (error) {
        console.error('카드 생성 오류:', error);
        res.status(500).send('Error creating card');
    }
};

// 카드 리스트 보기
exports.listCards = async (req, res) => {
    try {
        const cards = await Card.find();
        res.render('list', { data: cards });
    } catch (error) {
        console.error('카드 리스트 오류:', error);
        res.status(500).send('Error fetching card list');
    }
};

// 카드 상세 보기
exports.viewCard = async (req, res) => {
    const { from_name } = req.params;

    try {
        const card = await Card.findOne({ from_name });

        if (!card) return res.status(404).send('Card not found');
        res.render('view', { data: card });
    } catch (error) {
        console.error('카드 조회 오류:', error);
        res.status(500).send('Error fetching card');
    }
};

// 카드 내용 수정
exports.updateCard = async (req, res) => {
    const { from_name } = req.params;
    const { content } = req.body;

    try {
        await Card.findOneAndUpdate({ from_name }, { content });
        res.redirect('/');
    } catch (error) {
        console.error('카드 수정 오류:', error);
        res.status(500).send('Error updating card');
    }
};