const Card = require('../models/card');

exports.renderCardMenu = (req, res) => {
    res.render('card/menu');
};

exports.renderCreatePage = (req, res) => {
    const user = req.user || req.session.user;
    res.render('card/new', { user });
};

exports.handleCreateCard = async (req, res) => {
    const user = req.user || req.session.user;
    const { to_name, content } = req.body;
    const cardType = req.params.type;

    try {
        const newCard = new Card({
            from_name: user.nickname,
            to_name,
            content,
            card_type: "1"
        });

        await newCard.save();
        res.redirect('/card');
    } catch (error) {
        console.error('카드 생성 오류:', error);
        res.status(500).send('Error creating card');
    }
};

exports.renderSentCardList = async (req, res) => {
    const user = req.user;
    const cards = await Card.find({ from_name: user.nickname });
    res.render('card/sentList', { data: cards });
};

exports.renderReceivedCardList = async (req, res) => {
    const user = req.user;
    const cards = await Card.find({ to_name: user.nickname });
    res.render('card/receivedList', { data: cards });
};

exports.renderCardDetail = async (req, res) => {
    const card = await Card.findById(req.params.id);
    res.render('card/detail', { data: card });
};