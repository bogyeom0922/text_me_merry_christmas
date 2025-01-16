const {executeQuery} = require('../services/dbService');

exports.renderSignupPage = (req, res) => {
    res.render('user/signup');
};

exports.renderLoginPage = (req, res) => {
    res.render('user/login');
};

exports.handleSignup = (req, res) => {
    const {id, password, name, introduction} = req.body;
    if (!id || !password || !name || !introduction) {
        return res.status(400).send('Missing required fields');
    }

    const profileImage = req.file ? '/uploads/' + req.file.filename : null;
    console.log('id:', id, 'password:', password, 'name:', name, 'introduction:', introduction, 'profileImage:', profileImage);

    const query = 'INSERT INTO user (id, password, name, introduction, profile_image) VALUES (?, ?, ?, ?, ?)';
    const params = [id, password, name, introduction, profileImage];

    executeQuery(query, params)
        .then(() => {
            res.redirect('/user/login');
        })
        .catch(error => {
            console.error('error:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).send('Duplicate entry for user ID');
            } else {
                res.status(500).send('Error handling signup');
            }
        });
};