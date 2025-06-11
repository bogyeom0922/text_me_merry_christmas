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
            card_type: req.body.selected_card_type
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
  try {
    const card = await Card.findById(req.params.id);
    const user = req.session.user;

    if (!card) return res.status(404).send('Card not found');

    if (user && card.to_name === user.nickname && !card.confirmed) {
      card.confirmed = true;
      await card.save();
    }

    res.render('card/detail', {
      data: card,
      user: user,
      is_logined: !!user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading card detail');
  }
};

exports.updateCard = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const card = await Card.findById(id);
        const user = req.session.user;

        if (card.from_name === user.nickname && !card.confirmed) {
            card.content = content;
            await card.save();
            res.redirect(`/card/detail/${id}`);
        } else {
            res.status(403).send('수정 권한이 없습니다.');
        }
    } catch (err) {
        console.error('카드 수정 오류:', err);
        res.status(500).send('Error updating card');
    }
};