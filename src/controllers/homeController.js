exports.renderHomePage = async (req, res) => {
    try {
        const data = await Wish.find(); // 또는 원래 가져오던 데이터
        res.render('index', {
            data,
            is_logined: req.session.user ? true : false, // ✅ 여기에 추가
            user: req.session.user || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error rendering home page');
    }
};
