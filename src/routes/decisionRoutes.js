const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const decisionController = require('../controllers/decisionController');
const { isAuthenticated } = require('../middleware/auth');

const decisionValidation = [
  body('farm_id')
    .notEmpty().withMessage('Tarla seçimi zorunludur.')
    .isInt({ min: 1 }).withMessage('Geçerli bir tarla seçiniz.'),
  body('crop_type')
    .trim()
    .notEmpty().withMessage('Ürün tipi boş bırakılamaz.')
    .isLength({ min: 2, max: 100 }).withMessage('Ürün tipi 2-100 karakter arasında olmalıdır.')
];

router.get('/', isAuthenticated, decisionController.list);
router.get('/new', isAuthenticated, decisionController.showNewForm);
router.post('/', isAuthenticated, decisionValidation, decisionController.create);
router.get('/:id', isAuthenticated, decisionController.show);
router.post('/:id/delete', isAuthenticated, decisionController.delete);

module.exports = router;

