const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @openapi
 * /api/auth/users/{userId}:
 *   delete:
 *     summary: Remove user data
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of user to delete
 *     responses:
 *       200:
 *         description: User data successfully removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User {userId} deleted successfully
 *                 id:
 *                   type: string
 *                   format: uuid
 *       400:
 *         description: userId is required
 *       401:
 *         description: User unauthorized
 *       403:
 *         description: No permission to access resource
 */
router.delete('/:userId', async (req, res) => {
    const { userId } = req.params || {};

    if (!userId) {
        return res.status(400).json({
            error: "userId is required",
            code: "BAD_REQUEST",
        });
    }

    try {
        if (req.auth.role === 'ADMIN' || req.auth.sub === userId) {
            const userToBeDeleted = await prisma.User.delete({
                where: {
                    id: userId,
                },
            });

            return res.json({
                status: 200,
                msg: `User ${userToBeDeleted.id} deleted successfully`,
                id: userId
            });
        }
        return res.status(403).json({
            msg: 'No permission to access resource',
            code: 'FORBIDDEN'
        });

    } catch (error) {
        console.log(`DELETE /users/${userId} error:`, error);
        // OBS: db felmeddelandena kan innehåll hemligheter!!! -> skapa ett eget felmeddelande
        return res.status(401).json({
            msg: 'User unauthorized',
            code: 'UNAUTHORIZED'
        });
    }
});

module.exports = router;
