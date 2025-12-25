const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Ekim Karar Asistanı'
  });
});

module.exports = router;

