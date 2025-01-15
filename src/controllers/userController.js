const { executeQuery } = require('../services/dbService');

exports.renderSignupPage = (req, res) => {
    res.render('signup');
};

exports.handleSignup = (req, res) => {
    const { id, password, name, introduction, question, answer } = req.body;
    const query = 'INSERT INTO user (id, password, name, introduction, question, answer) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [id, password, name, introduction, question, answer];

    executeQuery(query, params)
        .then(() => {
            res.redirect('/');
        })
        .catch(error => {
            res.status(500).send('Error handling signup');
        });
};