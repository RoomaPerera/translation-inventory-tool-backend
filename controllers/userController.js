const User = require('../models/User')
const Language = require('../models/Language')
const mongoose = require('mongoose')

// Get all users with 'pending' status
const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ roleStatus: 'Pending' });
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending users.' });
    }
};

//Admin approval
const approveUser = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: 'Invalid User ID' });
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { roleStatus: 'Approved' }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User approved.', user });
    } catch (error) {
        res.status(500).json({ message: 'Approval failed.', error: error.message });
    }
};

// Assign languages to user
const assignLanguages = async (req, res) => {
    const userId = req.params.id;
    const { languages } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Only allow assignment to Translators
        if (user.role !== 'Translator') {
            return res.status(400).json({ message: "Languages can only be assigned to Translators." });
        }

        // Fetch all valid language codes from the Language collection
        const validLanguages = await Language.find().distinct('code');

        // Check for invalid (not in system) languages
        const invalidLanguages = languages.filter(lang => !validLanguages.includes(lang))
        if (invalidLanguages.length > 0) {
            return res.status(400).json({ message: `Invalid language(s): ${invalidLanguages.join(', ')}` })
        };


        // Check for already assigned languages
        const alreadyAssigned = languages.filter(lang => user.languages.includes(lang))
        if (alreadyAssigned.length > 0) {
            return res.status(400).json({ message: `The following language(s) are already assigned: ${alreadyAssigned.join(', ')}` })
        }

        // Assign the new languages
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { languages: { $each: languages } } },
            { new: true }
        )

        return res.status(200).json(updatedUser)

    } catch (error) {
        return res.status(500).json({ message: "Failed to assign languages", error: error.message });
    }
};


// Modify a user's assigned languages (Fixed)
const modifyLanguages = async (req, res) => {
    const userId = req.params.id;
    const { languages } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { languages },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to modify languages', error: error.message });
    }
};


//Delete User
const deleteUser = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid User ID' })
    }
    const user = await User.findByIdAndDelete(id)
    if (!user) {
        return res.status(404).json({ error: 'No such user' })
    }
    res.status(200).json({ mssg: 'User Deleted' })
}


// Get all users
const getUserList = async (req, res) => {
    try {
        const userList = await User.find({}, "userName role")
        res.status(200).json(userList)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//Filter User By Role
const filterUserList = async (req, res) => {
    const { role } = req.params
    try {
        const users = await User.find({ role }).select('userName')
        if (!users) {
            return res.status(404).json({ error: 'No such users' })
        }
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


module.exports = {
    getPendingUsers,
    approveUser,
    assignLanguages,
    modifyLanguages,
    deleteUser,
    getUserList,
    filterUserList
}