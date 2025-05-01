const express = require('express');
const router = express.Router();

const { 
    addLanguage,
    getAllLanguages,
    updateLanguage,
    deleteLanguage,
    assignLanguageToUser
} = require('../controllers/languageController');

const requireAuth = require('../middleware/requireAuth');
// Middleware
//router.use(requireAuth);

// Route to get all languages
router.get('/',requireAuth, getAllLanguages);

// Route to add a new language
router.post('/', requireAuth, addLanguage);


// Route to update a language
router.put('/:id', requireAuth, updateLanguage);

// Route to delete a language
router.delete('/:id',requireAuth, deleteLanguage);

// Route to assign languages to a user
router.post('/assign/:id',requireAuth, assignLanguageToUser);

module.exports = router;