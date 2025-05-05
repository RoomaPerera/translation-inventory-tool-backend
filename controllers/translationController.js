const Translation = require('../models/Translation');
const mongoose = require('mongoose'); 

// Get all translations
const getAllTranslations = async (req, res) => {
  try {
    const translations = await Translation.find();
    res.status(200).json(translations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get translations by language
const getTranslationsByLanguage = async (req, res) => {
  try {
    const { language } = req.params;
    const translations = await Translation.find({ language });
    res.status(200).json(translations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new translation
const createTranslation = async (req, res) => {
  try {
    const { key, language, translation } = req.body;

    // Check if translation already exists
    const existingTranslation = await Translation.findOne({ key, language });
    if (existingTranslation) {
      return res.status(400).json({ message: 'Translation already exists' });
    }

    const newTranslation = new Translation({ key, language, translation });
    const savedTranslation = await newTranslation.save();
    res.status(201).json(savedTranslation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update translation
const updateTranslation = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, language, translation } = req.body;

    const updatedTranslation = await Translation.findByIdAndUpdate(
      id,
      { key, language, translation },
      { new: true, runValidators: true }
    );

    if (!updatedTranslation) {
      return res.status(404).json({ message: 'Translation not found' });
    }

    res.status(200).json(updatedTranslation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete translation
const deleteTranslation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTranslation = await Translation.findByIdAndDelete(id);

    if (!deletedTranslation) {
      return res.status(404).json({ message: 'Translation not found' });
    }

    res.status(200).json({ message: 'Translation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export translations
const exportTranslations = async (req, res) => {
  try {
    const { format } = req.query;
    if (!format || (format !== 'json' && format !== 'csv')) {
      return res.status(400).json({ message: 'Invalid or missing export format. Use ?format=json or ?format=csv.' });
    }

    const translations = await Translation.find();

    if (format === 'json') {
      const jsonData = {};

      translations.forEach(item => {
        if (!jsonData[item.key]) {
          jsonData[item.key] = {};
        }
        jsonData[item.key][item.language] = item.translation;
      });

      return res.status(200).json(jsonData);
    } else if (format === 'csv') {
      let csvContent = 'key,language,translation\n';

      translations.forEach(item => {
        csvContent += `${item.key},${item.language},"${item.translation}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=translations.csv');
      return res.status(200).send(csvContent);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Generate translation files for a specific project
const generateTranslationFiles = async (req, res) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  try {
    const translations = await Translation.find({ projectId });

    if (translations.length === 0) {
      return res.status(404).json({ message: "No translations found for this project" });
    }

    const filesByLanguage = {};

    translations.forEach(t => {
      if (!filesByLanguage[t.language]) {
        filesByLanguage[t.language] = {};
      }
      filesByLanguage[t.language][t.key] = t.translation;
    });

    res.status(200).json({
      message: "Translation files generated",
      projectId,
      files: filesByLanguage
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating files", error: error.message });
  }
};

// Export all controller functions
module.exports = {
  getAllTranslations,
  getTranslationsByLanguage,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  exportTranslations,
  generateTranslationFiles
};
