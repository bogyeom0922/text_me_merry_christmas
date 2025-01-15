const {executeQuery} = require('../services/dbService');

exports.renderSignupPage = (req, res) => {
    res.render('user/signup');
};

exports.handleSignup = (req, res) => {
    const {id, password, name, introduction} = req.body;
    const profileImage = req.file ? '/uploads/' + req.file.filename : null;
    const query = 'INSERT INTO user (id, password, name, introduction, profile_image) VALUES (?, ?, ?, ?, ?)';
    const params = [id, password, name, introduction, profileImage];

    executeQuery(query, params)
        .then(() => {
            res.redirect('/');
        })
        .catch(error => {
            res.status(500).send('Error handling signup');
        });
};