const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user'); // User 모델

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
console.log('KAKAO_REST_API_KEY:', process.env.KAKAO_REST_API_KEY);
console.log('KAKAO_REDIRECT_URI:', process.env.KAKAO_REDIRECT_URI);

// 1. 카카오 로그인 시작
router.get('/kakao', (req, res) => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;
    res.redirect(kakaoAuthURL);
});

// 2. 콜백 처리
router.get('/kakao/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // 액세스 토큰 요청
        const tokenRes = await axios.post(
            `https://kauth.kakao.com/oauth/token`,
            {},
            {
                params: {
                    grant_type: 'authorization_code',
                    client_id: KAKAO_REST_API_KEY,
                    client_secret: process.env.KAKAO_CLIENT_SECRET,
                    redirect_uri: KAKAO_REDIRECT_URI,
                    code
                },
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            }
        );

        const { access_token } = tokenRes.data;

        // 사용자 정보 요청
        const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const kakaoAccount = userRes.data.kakao_account;

        // 유저 정보 DB에 저장 또는 로그인 처리
        const existingUser = await User.findOne({ email: kakaoAccount.email });

        if (existingUser) {
            // 로그인 처리
            req.session.user = {
                _id: existingUser._id,
                email: existingUser.email,
                nickname: existingUser.nickname
            };
            console.log('기존 사용자 로그인');
        } else {
            // 새 사용자 저장
            const newUser = new User({
                email: kakaoAccount.email,
                nickname: kakaoAccount.profile.nickname,
                password: 'kakao' // 필요시 구분용 (실제 로그인은 비밀번호 안 씀)
            });
            await newUser.save();

            req.session.user = {
                _id: newUser._id,
                email: newUser.email,
                nickname: newUser.nickname
            };

            console.log('신규 사용자 저장');
        }

        res.redirect('/'); // 로그인 후 메인 페이지 등으로 이동

    } catch (err) {
        console.error('카카오 로그인 오류:', err);
        res.status(500).send('카카오 로그인 실패');
    }
});

// 로그아웃
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;
