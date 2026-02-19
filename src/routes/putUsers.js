const express = require('express');
const {PrismaClient} = require('@prisma/client');
const {Roles} = require("../constants/roles");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @openapi
 * /api/auth/users:
 *   put:
 *     summary: Update user info
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - email
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 description: Can only be changed by ADMIN
 *     responses:
 *       200:
 *         description: User data updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       400:
 *         description: User not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.put('/', async (req, res) => {
    const {userId, email, role} = req.body || {};
    const auth = req.auth;

    if (auth.sub !== userId && auth.role !== Roles.ADMIN) {
        return res.status(401).json({
            error: 'Forbidden: insufficient permissions', code: 'FORBIDDEN',
        });
    }

    // Validation
    if (!userId || !email || !role) {
        return res.status(422).json({
            error: 'userId, email and role are required', code: 'VALIDATION_ERROR',
        });
    }
    if (!Object.values(Roles).includes(role)) {
        return res.status(422).json({
            error: 'Invalid role value', code: 'VALIDATION_ERROR',
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(422).json({
            error: 'Invalid email format', code: 'VALIDATION_ERROR',
        });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {

            // Lock the target user row to prevent concurrent modifications
            const lockedUsers = await tx.$queryRaw`
                SELECT * FROM "User"
                WHERE id = ${userId}::uuid
                FOR UPDATE
            `;

            const existingUser = lockedUsers[0];

            if (!existingUser) {
                throw new Error('USER_NOT_FOUND');
            }

            const updateData = {email};

            // Handle role update if provided
            if (role && role !== existingUser.role) {

                // Only ADMIN can change roles
                if (auth.role !== Roles.ADMIN) {
                    throw new Error('FORBIDDEN');
                }
                updateData.role = role;
            }

            // Perform update within the same transaction
            return await tx.user.update({
                where: {id: userId}, data: updateData,
            });
        });

        return res.json({
            id: result.id, email: result.email, role: result.role, createdAt: result.createdAt,
        });

    } catch (err) {
        if (err.message === 'USER_NOT_FOUND') {
            return res.status(400).json({
                error: 'User not found', code: 'USER_NOT_FOUND',
            });
        }

        if (err.message === 'FORBIDDEN') {
            return res.status(403).json({
                error: 'Forbidden: insufficient permissions', code: 'FORBIDDEN',
            });
        }

        if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
            return res.status(400).json({
                error: 'Email already exists', code: 'EMAIL_EXISTS',
            });
        }

        console.error('PUT /users error:', err);
        return res.status(500).json({
            error: 'Internal server error', code: 'INTERNAL_ERROR',
        });
    }
});

module.exports = router;