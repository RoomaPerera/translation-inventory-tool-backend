const Language = require('../models/Language');
const User = require('../models/User');
const mongoose = require('mongoose');

// REQ-17: Add New Language
const addLanguage = async (req, res) => {
  try {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({ message: 'Both language name and code are required' });
  }
const existingLanguage = await Language.findOne({ 
  $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }],
});
  if (existingLanguage) { 
    return res.status(409).json({ message: 'Language with this name or code already exists.' });
  }

    const newLanguage = new Language({ 
      name: name.trim(), 
      code: code.trim().toUpperCase() 
    });
    
    await newLanguage.save();
    res.status(201).json({ message: 'Language added successfully.', language: newLanguage });
  } catch (error) {
    console.error('🔥 Error adding language:', error);
    res.status(500).json({
      message: 'Error adding language',
      error: error.message || error,
    });
  }
};


// Fetch all languages
const getAllLanguages = async (req, res) => {
    try {
      const languages = await Language.find();
      res.status(200).json(languages);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching languages', error: err.message });
    }
  };



  // Update language
const updateLanguage = async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;
  
    try {
      const updatedLanguage = await Language.findByIdAndUpdate(id, { name, code }, { new: true });
      if (!updatedLanguage) {
        return res.status(404).json({ message: 'Language not found' });
      }
      res.status(200).json({ message: `Language with id ${id} updated successfully!`, updatedLanguage });
    } catch (err) {
      res.status(500).json({ message: 'Error updating language', error: err.message });
    }
  };

  // Delete language
const deleteLanguage = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedLanguage = await Language.findByIdAndDelete(id);
      if (!deletedLanguage) {
        return res.status(404).json({ message: 'Language not found' });
      }
      res.status(200).json({ message: `Language with id ${id} deleted successfully!`, deletedLanguage });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting language', error: err.message });
    }
  };
  

// REQ-18: Assign language to a translator
const assignLanguageToUser = async (req, res) => {
    const userId = req.params.id;
    const { languages } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Add only unique languages
      languages.forEach(lang => {
        if (!user.languages.includes(lang)) {
          user.languages.push(lang);
        }
      });
  
      await user.save();
  
      res.status(200).json({
        message: "Languages assigned successfully.",
        user
      });
    } catch (err) {
      res.status(500).json({ message: "Error assigning languages", error: err.message });
    }
  };

module.exports = {
    addLanguage,
    getAllLanguages,
    updateLanguage,
    deleteLanguage,
    assignLanguageToUser
};