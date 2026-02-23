const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const router = express.Router();
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'super-secret-key';
const issuer = process.env.JWT_ISSUER || 'user-auth';
const audience = process.env.JWT_AUDIENCE || 'user-frontend';
const expiresIn = '15m';
const successMessage = "A password reset request has been sent";
const emailurl = "https://email-service-cna-2026.2.rahtiapp.fi/";
const frontendResetUrl = "https://users-frontend-git-usersfrontend.1.rahtiapp.fi/reset-password?token=";
const emailApiKey = process.env.EMAIL_API_KEY;

/**
 * @openapi
 * /api/auth/users/requestPasswordReset:
 *   post:
 *     summary: Send password reset request email
 *     tags: 
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset request sent, is returned even if email doesn't exist in database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A password reset request has been sent
 *       422:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/requestPasswordReset', async (req, res) => {
    const { email } = req.body || {};

    if (!email) {
        return res.status(422).json({
            error: "email is required",
            code: "VALIDATION_ERROR",
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        return res.status(200).json({
            message: successMessage,
        });
    }

    try {
        const password_token = jwt.sign({ email: user.email, sub: user.id }, secret, {
            algorithm: 'HS256', issuer, audience, expiresIn,
        });

        const frontend_url = frontendResetUrl + password_token;

        const _ = await fetch(emailurl + "reset-password", {
            method: 'POST',
            headers: {
                'X-API-Key': emailApiKey,
            },
            body: JSON.stringify({
                email: user.email,
                name: 'UserName',
                link: frontend_url,
            }),
        });
        return res.status(200).json({
            message: successMessage,
        });
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            code: "INTERNAL_ERROR",
        });
    }
});

module.exports = router;
