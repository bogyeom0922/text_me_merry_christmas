const User = require('../models/user'); // 새로 만든 Mongoose 모델

exports.handleSignup = async (req, res) => {
    const { id, password, name, introduction } = req.body;

    if (!id || !password || !name || !introduction) {
        return res.status(400).send('Missing required fields');
    }

    const profileImage = req.file ? '/uploads/' + req.file.filename : null;

    console.log('id:', id, 'password:', password, 'name:', name, 'introduction:', introduction, 'profileImage:', profileImage);

    try {
        // 중복 이메일 확인
        const existingUser = await User.findOne({ email: id });
        if (existingUser) {
            return res.status(400).send('Duplicate entry for user ID');
        }

        // 새 유저 생성
        const newUser = new User({
            email: id,
            password,
            nickname: name,
            introduction,
            profileImage
        });

        await newUser.save(); // 저장

        res.redirect('/user/login');
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).send('Error handling signup');
    }
};
