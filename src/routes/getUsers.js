const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { Roles } = require('../constants/roles');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @openapi
 * /api/auth/users/{email}:
 *   get:
 *     summary: Get user info by email
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         required: true
 *         description: Email of user to get
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
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 address:
 *                   type: string
 *                 createdAt:
 *                   type: string
 * /api/auth/users:
 *   get:
 *     summary: Get all users info
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
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
 *                      name:
 *                        type: string
 *                      role:
 *                        type: string
 *                      address:
 *                        type: string
 *                      createdAt:
 *                        type: string
 *
 */
router.get('/', async (req, res) => {
    const auth = req.auth;

    if (auth.role !== Roles.ADMIN) {
        return res.status(401).json({
            error: 'Forbidden: insufficient permissions',
            code: 'FORBIDDEN',
        });
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                address: true,
                role: true,
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

router.get('/:email', async (req, res) => {
    const { email } = req.params;
    const auth = req.auth;

    if (!email) {
        return res.status(422).json({
            error: 'email is required',
            code: 'VALIDATION_ERROR',
        });
    }

    if (auth.email !== email && auth.role !== Roles.ADMIN) {
        return res.status(401).json({
            error: 'Forbidden: insufficient permissions',
            code: 'FORBIDDEN',
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { 
                email: email 
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                address: true,
                role: true,
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
        console.error('GET /users/:email error:', err);
        return res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR',
        });
    }
});

module.exports = router;
