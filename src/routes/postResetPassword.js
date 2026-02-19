const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const secret = process.env.JWT_SECRET || 'super-secret-key';
const issuer = process.env.JWT_ISSUER || 'user-auth';
const audience = process.env.JWT_AUDIENCE || 'user-frontend';

module.exports = (container) => {
    const router = express.Router();
    const passwordService = container.get('passwordService');

    /**
     * @openapi
     * /api/auth/users/resetPassword:
     *   post:
     *     summary: Reset user password using password reset token
     *     tags: 
     *       - Users
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - passwordResetToken
     *               - newPassword
     *             properties:
     *               passwordResetToken:
     *                 type: string
     *               newPassword:
     *                 type: string
     *                 format: password
     *     responses:
     *       200:
     *         description: Password reset successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Password reset successfully
     *       422:
     *         description: Invalid request body
     *       500:
     *         description: Internal server error
     */
    router.post('/resetPassword', async (req, res) => {
        const { passwordResetToken, newPassword } = req.body || {};

        if (!passwordResetToken || !newPassword) {
            return res.status(422).json({
                error: 'Token and newPassword are required',
                code: 'VALIDATION_ERROR',
            });
        }

        try {
            const payload = jwt.verify(passwordResetToken, secret, {
                issuer,
                audience,
            });

            const { sub: userId } = payload;

            await prisma.$transaction(async (tx) => {
                const passwordHash = await passwordService.hash(newPassword);

                await tx.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        passwordHash: passwordHash,
                    },
                });

                await tx.refreshToken.deleteMany({
                    where: {
                        userId: userId,
                    },
                });
            });

            return res.status(200).json({
                message: 'Password reset successfully',
            });
        } catch (err) {
            if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: 'Invalid or expired token',
                    code: 'INVALID_TOKEN',
                });
            }

            return res.status(500).json({
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
            });
        }
    });

    return router;
};