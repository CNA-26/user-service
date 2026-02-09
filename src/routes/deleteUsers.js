const express = require('express');
const { PrismaClient } = require('@prisma/client');
//const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @openapi
 * /api/auth/users/{userId}:
 *   delete:
 *     summary: Remove user data
 *     tags: 
 *       - Users
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
            code: "VALIDATION_ERROR",
        });
    }

    // TODO: admin deletion
    try {
        const authHeader = req.header('Authorization');
        const tokenToBeDeleted = authHeader.split(' ')[1];
        const refreshToken = await prisma.RefreshToken.findFirst({
            where: {
                token: tokenToBeDeleted,
            },
        });

        // guard statements to return
        if (refreshToken === null) {
            console.log('no token found to delete')
            return res.status(401).send({msg: "User delete failed"})
        }

        const deletedTokenAndUser = await prisma.RefreshToken.delete({
            where: {
                token: refreshToken
            },
        });

        res.json({
            status: 200,
            msg: `Token deleted OK for userId ${refreshToken.userId}!`
        });

    } catch (error) {
        console.log('DELETE /users/:userId error:', error);
        // OBS: db felmeddelandena kan innehåll hemligheter!!! -> skapa ett eget felmeddelande
        return res.status(401).json({
            msg: `Error: ${userId} delete failed`,
            code: 'VALIDATION_ERROR'
        });
    }
});

module.exports = router;
