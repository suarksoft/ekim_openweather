const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/auth');

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta adresi boş bırakılamaz.')
    .isEmail().withMessage('Geçerli bir e-posta adresi giriniz.'),
  body('password')
    .notEmpty().withMessage('Şifre boş bırakılamaz.')
    .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır.')
];

const registerValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta adresi boş bırakılamaz.')
    .isEmail().withMessage('Geçerli bir e-posta adresi giriniz.'),
  body('password')
    .notEmpty().withMessage('Şifre boş bırakılamaz.')
    .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.'),
  body('password_confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Şifreler eşleşmiyor.');
      }
      return true;
    }),
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Ad Soyad 2-200 karakter arasında olmalıdır.')
];

router.get('/login', redirectIfAuthenticated, authController.showLogin);
router.post('/login', redirectIfAuthenticated, loginValidation, authController.login);
router.get('/register', redirectIfAuthenticated, authController.showRegister);
router.post('/register', redirectIfAuthenticated, registerValidation, authController.register);
router.post('/logout', authController.logout);

module.exports = router;

