const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const mysql = require('mysql');
const path = require('path');
let db = null;
var fs = require('fs');
var ejs = require('ejs');

const {response} = require('express');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

require('dotenv').config();
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(express.static('public'));

app.get('/index.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.css'));
});

app.get('/signup2.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'sign2.css'));
});

app.get('/login.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'login.css'));
});

app.listen(8000);

app.get('/index', (req, res) => {
    fs.readFile('index.html', 'utf8', function (error, data) {
        con.query('SELECT * from wish', function (error, results) {
            console.log(results)
            res.send(ejs.render(data, {
                data: results
            }));
        });
    });
});

app.get('/sendcard', (req, res) => {
    res.sendFile(path.join(__dirname, 'sendcard.html'));
});


app.get('/list', (req, res) => {
    fs.readFile('list.html', 'utf8', function (error, data) {
        con.query('SELECT * FROM card', function (error, results) {
            res.send(ejs.render(data, {
                data: results
            }));
        });
    });
});

app.get('/view/:from_name', function (req, res) {
    fs.readFile('view.html', 'utf8', function (error, data) {
        con.query('SELECT * FROM card WHERE from_name = ?', [
            req.params.from_name
        ], function (error, result) {
            res.send(ejs.render(data, {
                data: result[0]
            }));
        });
    });
});

app.post('/view/:from_name', function (req, res) {
    var body = req.body;
    con.query('UPDATE card SET content=? WHERE from_name=?',
        [body.content, req.params.from_name], function () {
            res.redirect('/');
        });
});

app.get('/card1', function (req, res) {
    fs.readFile('card1.html', 'utf8', function (error, data) {
        res.send(data);
    });
});

app.post('/card1', function (req, res) {
    var body = req.body;
    con.query('INSERT INTO card VALUES (?,?,?,1)', [
        body.from_name, body.to_name, body.content, body.card
    ], function () {
        res.redirect('/index');
    });
});

app.get('/card2', function (req, res) {
    fs.readFile('card2.html', 'utf8', function (error, data) {
        res.send(data);
    });
});

app.post('/card2', function (req, res) {
    var body = req.body;
    con.query('INSERT INTO card VALUES (?,?,?,2)', [
        body.from_name, body.to_name, body.content, body.card
    ], function () {
        res.redirect('/index');
    });
});

app.get('/card3', function (req, res) {
    fs.readFile('card3.html', 'utf8', function (error, data) {
        res.send(data);
    });
});

app.post('/card3', function (req, res) {
    var body = req.body;
    con.query('INSERT INTO card VALUES (?,?,?,3)', [
        body.from_name, body.to_name, body.content, body.card
    ], function () {
        res.redirect('/index');
    });
});

app.get('/card4', function (req, res) {
    fs.readFile('card4.html', 'utf8', function (error, data) {
        res.send(data);
    });
});

app.post('/card4', function (req, res) {
    var body = req.body;
    con.query('INSERT INTO card VALUES (?,?,?,4)', [
        body.from_name, body.to_name, body.content, body.card
    ], function () {
        res.redirect('/index');
    });
});

app.get('/mypage', (req, res) => {
    res.sendFile(path.join(__dirname, 'mypage.html'));
});

app.get('/setting', (req, res) => {
    res.sendFile(path.join(__dirname, 'setting.html'));
});

app.get('/login.html', (req, res) => {
    fs.readFile('login.html', 'utf8', function (error, data) {
        con.query('SELECT * FROM user', function (error, results) {
            res.send(ejs.render(data, {
                data: results
            }));
        });
    });
});

app.get('/signup', function (req, res) {
    fs.readFile('signup.html', 'utf8', function (error, data) {
        res.send(data);
    });
});

app.post('/signup', function (req, res) {
    var body = req.body;
    con.query('INSERT INTO user VALUES (?,?,?,?,?,?)', [
        body.id, body.password, body.name, body.introduction, body.question, body.answer
    ], function () {
        res.redirect('/');
    });
});

app.get('/findid', function (req, res) {
    res.sendFile(path.join(__dirname, 'findid.html'));
});

app.get('/findpw', function (req, res) {
    res.sendFile(path.join(__dirname, 'findpw.html'));
});

app.get('/game_main', function (req, res) {
    fs.readFile('game_main.html', 'utf8', function (error, data) {
        res.send(data);
    });
});

app.get('/game', function (req, res) {
    fs.readFile('game.html', 'utf8', function (error, data) {
        res.send(data);
    });
});

app.get('/wish', (req, res) => {
    fs.readFile('wish.html', 'utf8', function (error, data) {
        con.query('SELECT * from wish', function (error, results) {
            res.send(ejs.render(data, {
                data: results
            }));
        });
    });
});

app.post('/create', (req, res) => {
    const sql = "insert into textmechristmas.wish set ? "
    console.log('완료')
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.redirect('/wish');
    });
});


app.get('/wish_list', (req, res) => {
    fs.readFile('wish_list.html', 'utf8', function (error, data) {
        con.query('SELECT * FROM card', function (error, results) {
            res.send(ejs.render(data, {
                data: results
            }));
        });
    });
});

app.get('/wish_view/:id', function (req, res) {
    fs.readFile('wish_view.html', 'utf8', function (error, data) {
        con.query('SELECT * FROM wish WHERE id = ?', [
            req.params.id
        ], function (error, result) {
            res.send(ejs.render(data, {
                data: result[0]
            }));
        });
    });
});

app.post('/wish_view/:id', function (req, res) {
    var body = req.body;
    con.query('UPDATE wish SET wish_contents=? WHERE id=?',
        [body.wish_contents, req.params.id], function () {
            res.redirect('/');
        });
});