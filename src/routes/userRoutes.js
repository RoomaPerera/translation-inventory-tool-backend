const express = require('express');
const router = express.Router();
const {
    approveUser,
    modifyLanguages, filterUserList,
    deleteUser, getUserList, getRejectedUsers,
    restoreRejectedUser, deleteRejectedUsers
} = require('../controllers/userController');

const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

router.use(requireAuth, requireRole('Admin'));

router.put('/approveUser', requireAuth, requireRole('Admin'), approveUser);
router.put('/modifyLanguages/:id', requireAuth, requireRole('Admin'), modifyLanguages);
router.delete('/deleteUser/:id', requireAuth, requireRole('Admin'), deleteUser);
router.get('/getUserList', requireAuth, requireRole('Admin'), getUserList);
router.get('/filterUserList/:role', requireAuth, requireRole('Admin'), filterUserList);
router.get('/getRejectedUsers', requireAuth, requireRole('Admin'), getRejectedUsers);
router.put('/restoreRejectedUser/:id', requireAuth, requireRole('Admin'), restoreRejectedUser);
router.delete('/deleteRejectedUsers', requireAuth, requireRole('Admin'), deleteRejectedUsers);

module.exports = router;