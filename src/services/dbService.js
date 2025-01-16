const pool = require('../models/db');

exports.executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};

exports.close = () => {
    return new Promise((resolve, reject) => {
        pool.end((error) => {
            if (error) {
                console.error('Error closing database pool:', error);
                return reject(error);
            }
            console.log('Database pool closed successfully');
            resolve();
        });
    });
};