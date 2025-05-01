const express = require('express')
const router = express.Router()
const {
    approveUser,
    assignLanguages,
    modifyLanguages,
    deleteUser,
    getUserList,
    filterUserList,
    getPendingUsers
} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

// Approve a user
router.put('/approveUser/:id', requireAuth, approveUser)

// Assign languages to a translator
router.post('/:id/assign-languages', requireAuth, assignLanguages)

// Modify languages for a user
router.put('/modifyLanguages/:id', requireAuth, modifyLanguages)

// Delete a user
router.delete('/deleteUser/:id', requireAuth, deleteUser)

// Get the user list
router.get('/getUserList', requireAuth, getUserList)

// Filter users by role
router.get('/filterUserList/:role', requireAuth, filterUserList)


//Get pending user list
router.get('/pendingUsers', requireAuth, getPendingUsers)

module.exports = router
