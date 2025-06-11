exports.ensureLogin = (req, res, next) => {
    res.locals.is_logined = !!req.session.user;
    res.locals.user = req.session.user || null;
    next(); // 무조건 다음으로 넘기되, 로그인 상태를 뷰에 전달
};