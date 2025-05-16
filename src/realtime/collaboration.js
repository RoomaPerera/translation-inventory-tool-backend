const Translation = require('../models/Translation');
const editLog = require('../models/editLog');

module.exports = function (io) {
    // Authentication middleware for sockets
    const verifyToken = require('../utils/jwt');
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        try {
            const { id, role } = verifyToken(token);
            socket.user = { id, role };
            next();
        } catch (err) {
            next(new Error('Authentication Error'));
        }
    });

    // handling each new socket connection
    io.on('connection', socket => {
        socket.on('joinTranslation', translationId => {
            socket.join(translationId);
            // audit log for join
            editLog.create({
                translation: translationId,
                userId: socket.user.id,
                action: 'join',
                payload: {},
            });
            socket.to(translationId).emit('userJoined', {
                userId: socket.user.id,
                joinedAt: new Date()
            });
        });
        // leave the room
        socket.on('leaveTranslation', translationId => {
            socket.leave(translationId);
            editLog.create({
                translationId: translationId,
                user: socket.user.id,
                action: 'leave',
                payload: {}
            });
            socket.to(translationId).emit('userLeft', {
                userId: socket.user.id,
                leftAt: new Date()
            });
        });

        // handling edits
        socket.on('editTranslation', async ({ translationId, nextText }) => {
            try {
                const t = await Translation.findById(translationId);
                if (!t) return;
                await t.addRevision(newText, socket.user.id);
                await editLog.create({
                    translation: translationId,
                    user: socket.user.id,
                    action: 'edit',
                    payload: { newText }
                });
                // Broadcast update to other collaborators
                socket.to(translationId).emit('translationUpdated', {
                    translationId,
                    newText,
                    updatedBy: socket.user.id,
                    updatedAt: new Date()
                });
            } catch (err) {
                console.log('Edit error:', err);
            }
        });
    });
}