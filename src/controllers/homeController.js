exports.renderHomePage = async (req, res) => {
    try {
        const data = await Wish.find().sort({ createdAt: -1 }); // 최신순 정렬
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
