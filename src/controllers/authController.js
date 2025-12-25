const User = require('../models/User');
const { validationResult } = require('express-validator');

class AuthController {
  static showLogin(req, res) {
    res.render('auth/login', {
      title: 'Giriş Yap',
      errors: [],
      email: ''
    });
  }

  static async login(req, res) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render('auth/login', {
        title: 'Giriş Yap',
        errors: errors.array(),
        email: req.body.email || ''
      });
    }

    try {
      const { email, password } = req.body;
      
      // Kullanıcıyı bul
      const user = await User.findByEmail(email);
      
      if (!user) {
        return res.render('auth/login', {
          title: 'Giriş Yap',
          errors: [{ msg: 'E-posta veya şifre hatalı.' }],
          email: email
        });
      }

      // Şifreyi kontrol et
      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      
      if (!isValidPassword) {
        return res.render('auth/login', {
          title: 'Giriş Yap',
          errors: [{ msg: 'E-posta veya şifre hatalı.' }],
          email: email
        });
      }

      // Session'a kullanıcı bilgilerini kaydet
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userName = user.full_name || user.email;

      // ReturnTo varsa oraya yönlendir, yoksa ana sayfaya
      const returnTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      
      res.redirect(returnTo);
    } catch (error) {
      console.error('Login error:', error);
      res.render('auth/login', {
        title: 'Giriş Yap',
        errors: [{ msg: 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.' }],
        email: req.body.email || ''
      });
    }
  }

  static showRegister(req, res) {
    res.render('auth/register', {
      title: 'Kayıt Ol',
      errors: [],
      user: {}
    });
  }

  static async register(req, res) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render('auth/register', {
        title: 'Kayıt Ol',
        errors: errors.array(),
        user: req.body
      });
    }

    try {
      const { email, password, full_name } = req.body;

      // E-posta zaten kayıtlı mı kontrol et
      const emailExists = await User.emailExists(email);
      if (emailExists) {
        return res.render('auth/register', {
          title: 'Kayıt Ol',
          errors: [{ msg: 'Bu e-posta adresi zaten kayıtlı.' }],
          user: req.body
        });
      }

      // Yeni kullanıcı oluştur
      const user = await User.create(email, password, full_name || null);

      // Otomatik giriş yap
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userName = user.full_name || user.email;

      res.redirect('/');
    } catch (error) {
      console.error('Register error:', error);
      res.render('auth/register', {
        title: 'Kayıt Ol',
        errors: [{ msg: 'Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.' }],
        user: req.body
      });
    }
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/auth/login');
    });
  }
}

module.exports = AuthController;

