// Middleware untuk memeriksa autentikasi
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login?error=unauthorized');
    }
}

module.exports = { isAuthenticated };
