const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

module.exports = (container) => {
    const router = express.Router();
    const passwordService = container.get('passwordService');

    /**
     * @openapi
     * /api/auth/users/updatePassword:
     *   patch:
     *     summary: Update user password, invalidates refresh token
     *     tags: 
     *       - Users
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - userId
     *               - password
     *               - newPassword
     *             properties:
     *               userId:
     *                 type: string
     *                 format: uuid
     *               password:
     *                 type: string
     *                 format: password
     *               newPassword:
     *                 type: string
     *                 format: password
     *     responses:
     *       200:
     *         description: User password updated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   format: uuid
     *                 message:
     *                   type: string
     *                   example: User password updated successfully
     *       401:
     *         description: User unauthorized
     *       422:
     *         description: Invalid request body
     *       500:
     *         description: Internal server error
     */
    router.patch('/updatePassword', async (req, res) => {
        const { userId, password, newPassword } = req.body || {};

        if (!userId || !password || !newPassword) {
            return res.status(422).json({
                error: "userId, password and newPassword are required",
                code: "VALIDATION_ERROR",
            });
        }

        try {
            updatePassword(userId, password, newPassword);

            return res.status(200).json({
                id: userId,
                message: "User password updated successfully",
            });
        } catch (err) {
            if (err.message === 'PASSWORD_COMPARISON_ERROR') {
                return res.status(500).json({
                    error: "Error comparing passwords",
                    code: "INTERNAL_ERROR",
                });
            }
            if (err.message === 'INCORRECT_PASSWORD') {
                return res.status(401).json({
                    error: "Incorrect password",
                    code: "WRONG_PASSWORD",
                })
            }

            console.log(err);
            return res.status(500).json({
                error: "Internal server errror",
                code: "INTERNAL_ERROR",
            });
        }
    });

    const updatePassword = (userId, password, newPassword) => {
        return prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: {
                    id: userId,
                },
            });

            bcrypt.compare(password, user.passwordHash, (err, result) => {
                if (err) {
                    throw new Error('PASSWORD_COMPARISON_ERROR');
                }
                if (!result) {
                    throw new Error('INCORRECT_PASSWORD');
                }
            });

            const passwordHash = await passwordService.hash(newPassword);

            await tx.user.update({
                where: {
                    id: userId,
                },
                data: {
                    passwordHash: passwordHash,
                },
            });

            await prisma.refreshToken.delete({
                where: {
                    userId: userId,
                },
            });
        });
    }

    return router;
}