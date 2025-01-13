const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();

app.use(cookieParser());
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(express.static('public'));

app.listen(8000);

// 템플릿
const sendFileResponse = (res, fileName) => {
    res.sendFile(path.join(__dirname, fileName), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("File Send Error");
        }
    });
};

const handleError = (res, error, errorMessage) => {
    console.error(error);
    res.status(500).send(errorMessage);
};

const executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        con.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};

const readFileAsync = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
};

const renderQueryResult = (res, template, query, params = []) => {
    executeQuery(query, params)
        .then((results) => {
            return readFileAsync(template);
        })
        .then((data) => {
            res.send(ejs.render(data, {data: results}));
        })
        .catch((error) => {
            handleError(res, error, "Database Query Error");
        });
};

app.get('/index', (req, res) => {
    renderQueryResult(res, 'index.html', 'SELECT * from wish');
});

app.get('/index.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.css'), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("File Send Error");
        }
    });
});

app.get('/view/:from_name', (req, res) => {
    renderQueryResult(res, 'view.html', 'SELECT * FROM card WHERE from_name = ?', [req.params.from_name]);
});

app.post('/view/:from_name', function (req, res) {
    const body = req.body;
    con.query('UPDATE card SET content=? WHERE from_name=?',
        [body.content, req.params.from_name], function (error) {
            if (error) {
                console.error(error);
                return res.status(500).send("Database Update Error");
            }
            res.redirect('/');
        });
});

app.get('/signup', function (req, res) {
    sendFileResponse(res, 'signup.html');
});

app.post('/signup', function (req, res) {
    const body = req.body;
    con.query('INSERT INTO user VALUES (?,?,?,?,?,?)', [
        body.id, body.password, body.name, body.introduction, body.question, body.answer
    ], function (error) {
        if (error) {
            console.error(error);
            return res.status(500).send("Database Insert Error");
        }
        res.redirect('/');
    });
});

app.get('/signup2.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'sign2.css'), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("File Send Error");
        }
    });
});

app.get('/findid', function (req, res) {
    sendFileResponse(res, 'findid.html');
});

app.get('/findpw', function (req, res) {
    sendFileResponse(res, 'findpw.html');
});

app.get('/login', function (req, res) {
    sendFileResponse(res, 'login.html');
});

app.get('/login.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'login.css'), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("File Send Error");
        }
    });
});

app.get('/sendcard', function (req, res) {
    sendFileResponse(res, 'sendcard.html');
});

app.get('/card/:type', function (req, res) {
    fs.readFile(`card${req.params.type}.html`, 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            return res.status(500).send("File Read Error");
        }
        res.send(data);
    });
});

app.post('/card/:type', function (req, res) {
    const body = req.body;
    const cardType = req.params.type;

    con.query('INSERT INTO card (from_name, to_name, content, card_type) VALUES (?, ?, ?, ?)', [
        body.from_name, body.to_name, body.content, cardType
    ], function (error) {
        if (error) {
            console.error(error);
            return res.status(500).send("Database Insert Error");
        }
        res.redirect('/index');
    });
});

app.get('/list', (req, res) => {
    renderQueryResult(res, 'list.html', 'SELECT * FROM card');
});

app.get('/mypage', (req, res) => {
    sendFileResponse(res, 'mypage.html');
});

app.get('/setting', (req, res) => {
    sendFileResponse(res, 'setting.html');
});

app.get('/game_main', function (req, res) {
    fs.readFile('game_main.html', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            return res.status(500).send("File Read Error");
        }
        res.send(data);
    });
});

app.get('/game', function (req, res) {
    fs.readFile('game.html', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            return res.status(500).send("File Read Error");
        }
        res.send(data);
    });
});

app.get('/wish', (req, res) => {
    fs.readFile('wish.html', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            return res.status(500).send("File Read Error");
        }
        con.query('SELECT * from wish', function (error, results) {
            if (error) {
                console.error(error);
                return res.status(500).send("Database Query Error");
            }
            res.send(ejs.render(data, {data: results}));
        });
    });
});

app.post('/create', (req, res) => {
    const sql = "insert into textmechristmas.wish set ? ";
    console.log('완료');
    con.query(sql, req.body, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database Insert Error");
        }
        console.log(result);
        res.redirect('/wish');
    });
});

app.get('/wish_list', (req, res) => {
    renderQueryResult(res, 'wish_list.html', 'SELECT * FROM card');
});

app.get('/wish_view/:id', (req, res) => {
    renderQueryResult(res, 'wish_view.html', 'SELECT * FROM wish WHERE id = ?', [req.params.id]);
});

app.post('/wish_view/:id', function (req, res) {
    const body = req.body;
    con.query('UPDATE wish SET wish_contents=? WHERE id=?',
        [body.wish_contents, req.params.id], function (error) {
            if (error) {
                console.error(error);
                return res.status(500).send("Database Update Error");
            }
            res.redirect('/');
        });
});