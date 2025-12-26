const Farm = require('../models/Farm');
const { validationResult } = require('express-validator');

class FarmController {
  static async list(req, res) {
    try {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const farms = await Farm.findAll(userId);
      res.render('farms/list', {
        title: 'Tarlalarım',
        farms
      });
    } catch (error) {
      console.error('Farm list error:', error);
      res.render('error', {
        title: 'Hata',
        message: 'Tarlalar listelenirken bir hata oluştu.',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  }

  static async showNewForm(req, res) {
    res.render('farms/new', {
      title: 'Yeni Tarla Ekle',
      farm: {},
      errors: []
    });
  }

  static async create(req, res) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render('farms/new', {
        title: 'Yeni Tarla Ekle',
        farm: req.body,
        errors: errors.array()
      });
    }

    try {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      await Farm.create(req.body, userId);
      res.redirect('/farms');
    } catch (error) {
      console.error('Farm create error:', error);
      res.render('farms/new', {
        title: 'Yeni Tarla Ekle',
        farm: req.body,
        errors: [{ msg: 'Tarla eklenirken bir hata oluştu. Lütfen tekrar deneyin.' }]
      });
    }
  }

  static async show(req, res) {
    try {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const farm = await Farm.findById(req.params.id, userId);
      if (!farm) {
        return res.status(404).render('error', {
          title: 'Tarla Bulunamadı',
          message: 'Aradığınız tarla bulunamadı veya size ait değil.',
          error: {}
        });
      }
      res.render('farms/show', {
        title: `Tarla: ${farm.name}`,
        farm
      });
    } catch (error) {
      console.error('Farm show error:', error);
      res.render('error', {
        title: 'Hata',
        message: 'Tarla bilgileri alınırken bir hata oluştu.',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  }

  static async showEditForm(req, res) {
    try {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const farm = await Farm.findById(req.params.id, userId);
      if (!farm) {
        return res.status(404).render('error', {
          title: 'Tarla Bulunamadı',
          message: 'Aradığınız tarla bulunamadı veya size ait değil.',
          error: {}
        });
      }
      res.render('farms/edit', {
        title: `Tarla Düzenle: ${farm.name}`,
        farm,
        errors: []
      });
    } catch (error) {
      console.error('Farm showEditForm error:', error);
      res.render('error', {
        title: 'Hata',
        message: 'Tarla bilgileri alınırken bir hata oluştu.',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  }

  static async update(req, res) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const farm = await Farm.findById(req.params.id, userId).catch(() => null);
      return res.render('farms/edit', {
        title: 'Tarla Düzenle',
        farm: { ...farm, ...req.body },
        errors: errors.array()
      });
    }

    try {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const farm = await Farm.update(req.params.id, req.body, userId);
      if (!farm) {
        return res.status(404).render('error', {
          title: 'Tarla Bulunamadı',
          message: 'Aradığınız tarla bulunamadı veya size ait değil.',
          error: {}
        });
      }
      res.redirect('/farms');
    } catch (error) {
      console.error('Farm update error:', error);
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const farm = await Farm.findById(req.params.id, userId).catch(() => null);
      res.render('farms/edit', {
        title: 'Tarla Düzenle',
        farm: { ...farm, ...req.body },
        errors: [{ msg: 'Tarla güncellenirken bir hata oluştu. Lütfen tekrar deneyin.' }]
      });
    }
  }

  static async delete(req, res) {
    try {
      const userId = null; // Auth kaldırıldı - şimdilik göstermelik
      const farm = await Farm.delete(req.params.id, userId);
      if (!farm) {
        return res.status(404).render('error', {
          title: 'Tarla Bulunamadı',
          message: 'Aradığınız tarla bulunamadı veya size ait değil.',
          error: {}
        });
      }
      res.redirect('/farms');
    } catch (error) {
      console.error('Farm delete error:', error);
      res.render('error', {
        title: 'Hata',
        message: 'Tarla silinirken bir hata oluştu.',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  }
}

module.exports = FarmController;

