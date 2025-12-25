// Authentication middleware - kullanıcının giriş yapıp yapmadığını kontrol eder
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
  }
};

// Zaten giriş yapmış kullanıcıları login/register sayfalarından yönlendir
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  next();
};

module.exports = {
  isAuthenticated,
  redirectIfAuthenticated
};

