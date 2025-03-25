const express = require('express');
const router = express.Router();
const Wish = require('../models/wish');
const Card = require('../models/card');

// 전체 소원 목록
router.get('/', async (req, res) => {
    try {
        const results = await Wish.find({});
        res.render('wish/wish', { data: results });
    } catch (err) {
        res.status(500).send('DB Error');
    }
});

// 소원 등록
router.post('/create', async (req, res) => {
    try {
        await Wish.create(req.body);
        res.redirect('/wish');
    } catch (err) {
        res.status(500).send('DB Insert Error');
    }
});

// 카드 리스트 보기 (wish_list에서 card 조회)
router.get('/list', async (req, res) => {
    try {
        const results = await Card.find({});
        res.render('wish/wish_list', { data: results });
    } catch (err) {
        res.status(500).send('DB Error');
    }
});

// 소원 보기
router.get('/view/:id', async (req, res) => {
    try {
        const result = await Wish.findById(req.params.id);
        if (!result) return res.status(404).send('Not found');
        res.render('wish/wish_view', { data: result });
    } catch (err) {
        res.status(500).send('DB Error');
    }
});

// 소원 수정
router.post('/view/:id', async (req, res) => {
    try {
        await Wish.findByIdAndUpdate(req.params.id, {
            wish_contents: req.body.wish_contents
        });
        res.redirect('/');
    } catch (err) {
        res.status(500).send('DB Update Error');
    }
});

module.exports = router;