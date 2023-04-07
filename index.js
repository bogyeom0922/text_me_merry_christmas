const express = require('express');
const app=express();
const bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
const mysql = require('mysql');
const path = require('path');
let db=null;
const fs=require('fs');
var ejs = require('ejs');
const { response } = require('express');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); 

app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const con = mysql.createConnection({
  user : 'root',
  password : '0922',
  database : 'textmechristmas'
});

app.use(express.static('public'));

app.get('/index.css', function(req, res) {
  fs.sendFile(__dirname, 'index.css');
});

app.get('/signup2.css', function(req, res) {
  res.sendFile(__dirname, 'sign2.css');
});

app.get('/login.css', function(req, res) {
  res.sendFile(__dirname, 'login.css');
});

// ejs 설정 4
app.set('views', __dirname + '\\views');
app.set('view engine','ejs');

// 정제 (미들웨어) 5
app.use(bodyParser.urlencoded({extended:false}));

// 세션 (미들웨어) 6
app.use(session({
    secret: 'blackzat', // 데이터를 암호화 하기 위해 필요한 옵션
    resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
    saveUninitialized: true, // 세션이 필요하면 세션을 실행시칸다(서버에 부담을 줄이기 위해)
    store : new FileStore() // 세션이 데이터를 저장하는 곳
}));

app.get('/',(req,res)=>{
  console.log('메인페이지 작동');
  console.log(req.session);
  if(req.session.is_logined == true){
      res.render('index',{
          is_logined : req.session.is_logined,
          name : req.session.name
      });
  }else{
      res.render('index',{
          is_logined : false
      });
  }
});

app.get('/login',(req,res)=>{
  console.log('로그인 작동');
  res.render('login');
});

app.post('/login',(req,res)=>{
  const body = req.body;
  const id = body.id;
  const password = body.password;

  con.query('select * from user where id=?',[id],(err,data)=>{
      // 로그인 확인
      console.log(data[0]);
      console.log(id);
      console.log(data[0].id);
      console.log(data[0].password);
      console.log(id == data[0].id);
      console.log(password == data[0].password);
      if(id == data[0].id || password == data[0].password){
          console.log('로그인 성공');
          res.redirect('/index')
          // 세션에 추가
          req.session.is_logined = true;
          req.session.name = data.name;
          req.session.id = data.id;
          req.session.password = data.password;
          req.session.save(function(){ // 세션 스토어에 적용하는 작업
              res.render('index',{ // 정보전달
                  name : data[0].name,
                  id : data[0].id,
                  is_logined : true
              });
          });
      }else{
          console.log('로그인 실패');
          res.render('login');
      }
  });
  
});

// 로그아웃
app.get('/logout',(req,res)=>{
  console.log('로그아웃 성공');
  req.session.destroy(function(err){
      // 세션 파괴후 할 것들
      res.redirect('/login');
  });

});


app.get('/index',(req,res)=>{
  fs.readFile('index.html','utf8', function(error, data){
    con.query('SELECT * from wish',function(error, results){
        console.log(results)
      res.send(ejs.render(data,{
        data:results
      }));
    });
  });
});

app.get('/sendcard',(req,res)=>{
  res.sendFile(path.join(__dirname, 'sendcard.html'));
});


app.get('/list',(req,res)=>{
  fs.readFile('list.html', 'utf8', function(error, data) {
    con.query('SELECT * FROM card', function (error, results) {
      res.send(ejs.render(data, {
        data:results
      }));
    });
  });
});

app.get('/view/:from_name', function(req, res) {
  fs.readFile('view.html', 'utf8', function(error, data) {
    con.query('SELECT * FROM card WHERE from_name = ?', [
      req.params.from_name
    ], function(error, result) {
      res.send(ejs.render(data, {
        data:result[0]
      }));
    });
  });
});

app.post('/view/:from_name', function(req, res) {
  var body = req.body;
  con.query('UPDATE card SET content=? WHERE from_name=?',
  [body.content, req.params.from_name], function() {
    res.redirect('/');
  });
});

app.get('/card1', function(req,res) {
  fs.readFile('card1.html', 'utf8', function(error, data) {
    res.send(data);
  });
});

app.post('/card1', function(req, res) {
  var body = req.body;
  con.query('INSERT INTO card VALUES (?,?,?,1)', [
    body.from_name, body.to_name, body.content, body.card
  ], function() {
    res.redirect('/index');
  });
});

app.get('/card2', function(req,res) {
  fs.readFile('card2.html', 'utf8', function(error, data) {
    res.send(data);
  });
});

app.post('/card2', function(req, res) {
  var body = req.body;
  con.query('INSERT INTO card VALUES (?,?,?,2)', [
    body.from_name, body.to_name, body.content, body.card
  ], function() {
    res.redirect('/index');
  });
});

app.get('/card3', function(req,res) {
  fs.readFile('card3.html', 'utf8', function(error, data) {
    res.send(data);
  });
});

app.post('/card3', function(req, res) {
  var body = req.body;
  con.query('INSERT INTO card VALUES (?,?,?,3)', [
    body.from_name, body.to_name, body.content, body.card
  ], function() {
    res.redirect('/index');
  });
});

app.get('/card4', function(req,res) {
  fs.readFile('card4.html', 'utf8', function(error, data) {
    res.send(data);
  });
});

app.post('/card4', function(req, res) {
  var body = req.body;
  con.query('INSERT INTO card VALUES (?,?,?,4)', [
    body.from_name, body.to_name, body.content, body.card
  ], function() {
    res.redirect('/index');
  });
});

app.get('/mypage',(req,res)=>{
  res.sendFile(path.join(__dirname, 'mypage.html'));
});


app.get('/setting',(req,res)=>{
  res.sendFile(path.join(__dirname, 'setting.html'));
});

app.post('/setting', function(req, res) {
  var body = req.body;
  con.query('UPDATE user SET introduction=? WHERE id="bogyeom"',
  [body.intro], function() {
    res.redirect('/setting');
  });
});


app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup',function(req,res) {
  fs.readFile('signup.html', 'utf8', function(error, data) {
    res.send(data);
  });
});

app.post('/signup', function(req, res) {
  var body = req.body;
  con.query('INSERT INTO user VALUES (?,?,?,?)', [
    body.id, body.password, body.name, body.introduction
  ], function() {
    res.redirect('/');
  });
});

app.get('/findid',function(req,res) {
  res.sendFile(path.join(__dirname, 'findid.html'));
});

app.get('/findpw',function(req,res) {
  res.sendFile(path.join(__dirname, 'findpw.html'));
});

app.get('/game_main',function(req,res) {
  fs.readFile('game_main.html', 'utf8', function(error, data) {
    res.send(data);
  });
});

app.get('/game',function(req,res) {
  fs.readFile('game.html', 'utf8', function(error, data) {
    res.send(data);
  });
});

app.get('/wish',(req,res)=>{
  fs.readFile('wish.html','utf8', function(error, data){
    con.query('SELECT * from wish',function(error, results){
      res.send(ejs.render(data,{
        data:results
      }));
    });
  });
});

app.post('/create',(req,res)=>{
 const sql= "insert into textmechristmas.wish set ? "
 console.log('완료')
 con.query(sql, req.body, function(err, result, fields){
  if (err) throw err;
  console.log(result);
  res.redirect('/wish');
 });
});


app.get('/wish_list',(req,res)=>{
  fs.readFile('wish_list.html', 'utf8', function(error, data) {
    con.query('SELECT * FROM card', function (error, results) {
      res.send(ejs.render(data, {
        data:results
      }));
    });
  });
});

app.get('/wish_view/:id', function(req, res) {
  fs.readFile('wish_view.html', 'utf8', function(error, data) {
    con.query('SELECT * FROM wish WHERE id = ?', [
      req.params.id
    ], function(error, result) {
      res.send(ejs.render(data, {
          data:result[0]
      }));
    });
  });
});

app.post('/wish_view/:id', function(req, res) {
  var body = req.body;
  con.query('UPDATE wish SET wish_contents=? WHERE id=?',
  [body.wish_contents, req.params.id], function() {
    res.redirect('/');
  });
});

app.listen(8000,()=>{
  console.log('3000 port running...');
});
