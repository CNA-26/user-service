const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @openapi
 * /api/auth/users/{userId}:
 *   get:
 *     summary: Get user info
 *     tags: 
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of user to get
 *     responses:
 *       200:
 *         description: User data successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 email:
 *                   type: string
 *                   format: email
 *                 userName:
 *                   type: string
 * /api/auth/users:
 *   get:
 *     summary: Get all users info
 *     tags: 
 *       - Users
 *     responses:
 *       200:
 *         description: Users data successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     properties:
 *                      id:
 *                        type: string
 *                        format: uuid
 *                      email:
 *                        type: string
 *                        format: email
 *                      userName:
 *                        type: string
 */
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });

        return res.json(users);
    } catch (err) {
        console.error('GET /users error:', err);
        return res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR',
        });
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(422).json({
            error: 'userId is required',
            code: 'VALIDATION_ERROR',
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { 
                id: userId 
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(400).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND',
            });
        }

        return res.json(user);
    } catch (err) {
        console.error('GET /users/:userId error:', err);
        return res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR',
        });
    }
});

module.exports = router;