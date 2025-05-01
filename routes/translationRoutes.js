const express = require('express');
const router = express.Router();
const {
  getFilteredTranslations,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  getTranslationsByLanguage,
  exportTranslations,
  generateTranslationFiles
} = require('../controllers/translationController');

// GET: Get translations with optional filters (key, language, project)
router.get('/', getFilteredTranslations);

// POST: Add a new translation
router.post('/', createTranslation);

// PUT: Update a translation by ID
router.put('/:id', updateTranslation);

// DELETE: Delete a translation by ID
router.delete('/:id', deleteTranslation);

// GET: Get translations by language
router.get('/language/:language', getTranslationsByLanguage);

// GET: Export translations (format=json|csv)
router.get('/export', exportTranslations);

// GET: Generate translation files by project ID
router.get('/generate/:projectId', generateTranslationFiles);

module.exports = router;

