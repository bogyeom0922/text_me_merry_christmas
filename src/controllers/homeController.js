const { executeQuery } = require('../services/dbService');

exports.renderHomePage = (req, res) => {
    executeQuery('SELECT * FROM wish')
        .then(results => {
            res.render('index', { data: results });
        })
        .catch(error => {
            res.status(500).send('Error rendering home page');
        });
};