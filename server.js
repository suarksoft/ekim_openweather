require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'ekim-karar-asistani-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    // Production'da reverse proxy varsa (nginx, Cloudflare vb.) secure: false kullanılabilir
    // Reverse proxy HTTPS'i handle ediyorsa ve X-Forwarded-Proto header'ı varsa
    secure: process.env.COOKIE_SECURE === 'true' || (process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false'),
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 saat
    sameSite: 'lax' // CSRF koruması için
  }
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Session verilerini view'lara aktar
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? {
    id: req.session.userId,
    email: req.session.userEmail,
    name: req.session.userName
  } : null;
  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Routes
const homeRoutes = require('./src/routes/homeRoutes');
const authRoutes = require('./src/routes/authRoutes');
const farmRoutes = require('./src/routes/farmRoutes');
const decisionRoutes = require('./src/routes/decisionRoutes');

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/farms', farmRoutes);
app.use('/decisions', decisionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Hata',
    message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Sayfa Bulunamadı',
    message: 'Aradığınız sayfa bulunamadı.',
    error: {}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

