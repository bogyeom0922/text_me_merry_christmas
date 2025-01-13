const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const {urlencoded} = require("body-parser");

app.use(urlencoded({extended: true}));
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
    res.sendFile(path.join(__dirname, 'index.css'), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("File Send Error");
        }
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

app.get('/login.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'login.css'), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("File Send Error");
        }
    });
});

app.listen(8000);

app.get('/index', (req, res) => {
    fs.readFile('index.html', 'utf8', function (error, data) {
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

app.get('/sendcard', (req, res) => {
    res.sendFile(path.join(__dirname, 'sendcard.html'), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("File Send Error");
        }
    });
});

app.get('/list', (req, res) => {
    fs.readFile('list.html', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            return res.status(500).send("File Read Error");
        }
        con.query('SELECT * FROM card', function (error, results) {
            if (error) {
                console.error(error);
                return res.status(500).send("Database Query Error");
            }
            res.send(ejs.render(data, {data: results}));
        });
    });
});

app.get('/view/:from_name', function (req, res) {
    fs.readFile('view.html', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            return res.status(500).send("File Read Error");
        }

        con.query('SELECT * FROM card WHERE from_name = ?', [
            req.params.from_name
        ], function (error, result) {
            if (error) {
                console.error(error);
                return res.status(500).send("Database Query Error");
            }
            if (result.length === 0) {
                return res.status(404).send("No card found for the specified name");
            }
            res.send(ejs.render(data, {data: result[0]}));
        });
    });
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

app.get('/mypage', (req, res) => {
    res.sendFile(path.join(__dirname, 'mypage.html'), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("File Send Error");
        }
    });
});

app.get('/setting', (req, res) => {
    res.sendFile(path.join(__dirname, 'setting.html'), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("File Send Error");
        }
    });
});

app.get('/login.html', (req, res) => {
    fs.readFile('login.html', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            return res.status(500).send("File Read Error");
        }
        con.query('SELECT * FROM user', function (error, results) {
            if (error) {
                console.error(error);
                return res.status(500).send("Database Query Error");
            }
            res.send(ejs.render(data, {data: results}));
        });
    });
});

app.get('/signup', function (req, res) {
    fs.readFile('signup.html', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            return res.status(500).send("File Read Error");
        }
        res.send(data);
    });
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

app.get('/findid', function (req, res) {
    res.sendFile(path.join(__dirname, 'findid.html'), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("File Send Error");
        }
    });
});

app.get('/findpw', function (req, res) {
    res.sendFile(path.join(__dirname, 'findpw.html'), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("File Send Error");
        }
    });
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
    fs.readFile('wish_list.html', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            return res.status(500).send("File Read Error");
        }
        con.query('SELECT * FROM card', function (error, results) {
            if (error) {
                console.error(error);
                return res.status(500).send("Database Query Error");
            }
            res.send(ejs.render(data, {data: results}));
        });
    });
});

app.get('/wish_view/:id', function (req, res) {
    fs.readFile('wish_view.html', 'utf8', function (error, data) {
        if (error) {
            console.error(error);
            return res.status(500).send("File Read Error");
        }
        con.query('SELECT * FROM wish WHERE id = ?', [
            req.params.id
        ], function (error, result) {
            if (error) {
                console.error(error);
                return res.status(500).send("Database Query Error");
            }
            if (result.length === 0) {
                return res.status(404).send("No wish found for the specified ID");
            }
            res.send(ejs.render(data, {data: result[0]}));
        });
    });
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