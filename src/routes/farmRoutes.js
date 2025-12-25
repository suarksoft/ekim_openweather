const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const farmController = require('../controllers/farmController');
const { isAuthenticated } = require('../middleware/auth');

const farmValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tarla adı boş bırakılamaz.')
    .isLength({ min: 2, max: 200 }).withMessage('Tarla adı 2-200 karakter arasında olmalıdır.'),
  body('city')
    .trim()
    .notEmpty().withMessage('Şehir adı boş bırakılamaz.')
    .isLength({ min: 2, max: 100 }).withMessage('Şehir adı 2-100 karakter arasında olmalıdır.'),
  body('district')
    .trim()
    .notEmpty().withMessage('İlçe adı boş bırakılamaz.')
    .isLength({ min: 2, max: 100 }).withMessage('İlçe adı 2-100 karakter arasında olmalıdır.'),
  body('area_decare')
    .notEmpty().withMessage('Alan bilgisi boş bırakılamaz.')
    .isFloat({ min: 0.01 }).withMessage('Alan 0.01 dekardan büyük olmalıdır.')
    .toFloat()
];

router.get('/', isAuthenticated, farmController.list);
router.get('/new', isAuthenticated, farmController.showNewForm);
router.post('/', isAuthenticated, farmValidation, farmController.create);
router.get('/:id', isAuthenticated, farmController.show);
router.get('/:id/edit', isAuthenticated, farmController.showEditForm);
router.post('/:id', isAuthenticated, farmValidation, farmController.update);
router.post('/:id/delete', isAuthenticated, farmController.delete);

module.exports = router;

