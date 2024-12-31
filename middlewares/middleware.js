
// Middleware untuk memeriksa autentikasi
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login?error=unauthorized');
    }
}

// Middleware untuk memeriksa role admin
function isAdmin(req, res, next) {
    if (req.session.role === 'admin') {
        return next();
    } else {
        res.status(403).send('Access Denied: Admins only!');
    }
}

// Middleware untuk memeriksa role user
function isUser(req, res, next) {
    if (req.session.role === 'user') {
        return next();
    } else {
        res.status(403).send('Access Denied: Users only!');
    }
}

module.exports = { isAuthenticated, isAdmin, isUser };
