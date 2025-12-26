const Decision = require('../models/Decision');
const Farm = require('../models/Farm');
const DecisionEngine = require('../services/decisionEngine');
const { validationResult } = require('express-validator');

class DecisionController {
  static async list(req, res) {
    try {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const decisions = await Decision.findAll(userId);
      res.render('decisions/list', {
        title: 'Karar Geçmişi',
        decisions
      });
    } catch (error) {
      console.error('Decision list error:', error);
      res.render('error', {
        title: 'Hata',
        message: 'Kararlar listelenirken bir hata oluştu.',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  }

  static async showNewForm(req, res) {
    try {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const farms = await Farm.findAll(userId);
      res.render('decisions/new', {
        title: 'Ekim Kararı Al',
        farms,
        decision: {},
        errors: []
      });
    } catch (error) {
      console.error('Decision showNewForm error:', error);
      res.render('error', {
        title: 'Hata',
        message: 'Form yüklenirken bir hata oluştu.',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  }

  static async create(req, res) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const farms = await Farm.findAll(userId).catch(() => []);
      return res.render('decisions/new', {
        title: 'Ekim Kararı Al',
        farms,
        decision: req.body,
        errors: errors.array()
      });
    }

    try {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      // Farm bilgisini al (kullanıcının tarlası olduğundan emin ol)
      const farm = await Farm.findById(req.body.farm_id, userId);
      if (!farm) {
        const farms = await Farm.findAll(userId);
        return res.render('decisions/new', {
          title: 'Ekim Kararı Al',
          farms,
          decision: req.body,
          errors: [{ msg: 'Seçilen tarla bulunamadı.' }]
        });
      }

      // Karar üret
      const decisionData = await DecisionEngine.generateDecision(
        req.body.farm_id,
        req.body.crop_type,
        farm.city,
        farm.district,
        req.body.date || null
      );

      // Veritabanına kaydet
      await Decision.create(decisionData);

      res.redirect('/decisions');
    } catch (error) {
      console.error('Decision create error:', error);
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const farms = await Farm.findAll(userId).catch(() => []);
      res.render('decisions/new', {
        title: 'Ekim Kararı Al',
        farms,
        decision: req.body,
        errors: [{ msg: error.message || 'Karar oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.' }]
      });
    }
  }

  static async show(req, res) {
    try {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const decision = await Decision.findById(req.params.id, userId);
      if (!decision) {
        return res.status(404).render('error', {
          title: 'Karar Bulunamadı',
          message: 'Aradığınız karar bulunamadı veya size ait değil.',
          error: {}
        });
      }

      // Parse weather snapshot JSON
      let weatherSnapshot = null;
      if (decision.weather_snapshot_json) {
        try {
          weatherSnapshot = typeof decision.weather_snapshot_json === 'string' 
            ? JSON.parse(decision.weather_snapshot_json) 
            : decision.weather_snapshot_json;
        } catch (e) {
          console.error('JSON parse error:', e);
        }
      }

      res.render('decisions/show', {
        title: `Karar Detayı #${decision.id}`,
        decision,
        weatherSnapshot
      });
    } catch (error) {
      console.error('Decision show error:', error);
      res.render('error', {
        title: 'Hata',
        message: 'Karar bilgileri alınırken bir hata oluştu.',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  }

  static async delete(req, res) {
    try {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const decision = await Decision.delete(req.params.id, userId);
      if (!decision) {
        return res.status(404).render('error', {
          title: 'Karar Bulunamadı',
          message: 'Aradığınız karar bulunamadı veya size ait değil.',
          error: {}
        });
      }
      res.redirect('/decisions');
    } catch (error) {
      console.error('Decision delete error:', error);
      res.render('error', {
        title: 'Hata',
        message: 'Karar silinirken bir hata oluştu.',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  }
}

module.exports = DecisionController;

