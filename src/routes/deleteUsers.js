const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

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
 *           type: integer
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
 */
router.delete('/:userId', async (req, res) => {
    return res.status(404).json({
        error: "dead endpoint"
    })
});

module.exports = router;