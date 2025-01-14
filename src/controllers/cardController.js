const { executeQuery } = require('../services/dbService');

exports.renderCardPage = (req, res) => {
    const { type } = req.params;
    res.render(`card${type}`);
};

exports.handleCreateCard = (req, res) => {
    const { from_name, to_name, content } = req.body;
    const cardType = req.params.type;
    const query = 'INSERT INTO card (from_name, to_name, content, card_type) VALUES (?, ?, ?, ?)';
    const params = [from_name, to_name, content, cardType];

    executeQuery(query, params)
        .then(() => {
            res.redirect('/index');
        })
        .catch(error => {
            res.status(500).send('Error creating card');
        });
};