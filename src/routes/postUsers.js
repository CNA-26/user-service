const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = (container) => {
    const router = express.Router();
    const passwordService = container.get('passwordService');
    const emailApiKey = process.env.EMAIL_API_KEY || 'super-secret-key';
    const emailServiceUrl = process.env.EMAIL_SERVICE_URL || 'http://localhost:3001';

    /**
     * @openapi
     * /api/auth/users:
     *   post:
     *     summary: Create a new user
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
     *               - password
     *               - name
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 format: password
     *               name:
     *                 type: string
     *                 description: User's full name
     *     responses:
     *       201:
     *         description: User successfully created
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
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *       400:
     *         description: Email already exists
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                 code:
     *                   type: string
     *       422:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                 code:
     *                   type: string
     *       500:
     *         description: Internal server error
     */

    router.post('/', async (req, res) => {
        const { email, password, name } = req.body || {};

        if (!email || !password || !name) {
            return res.status(422).json({
                error: 'Email, password and name are required', code: 'VALIDATION_ERROR',
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(422).json({
                error: 'Invalid email format', code: 'VALIDATION_ERROR',
            });
        }

        try {
            const passwordHash = await passwordService.hash(password);
            console.log(passwordHash);

            const user = await prisma.user.create({
                data: {
                    email, passwordHash, name
                },
            });

            // Send registration email via Email Service
            try {

                const response = await fetch(`${emailServiceUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': emailApiKey,
                    },
                    body: JSON.stringify({
                        email: email,
                        name: name,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Email service returned error:', response.status, errorData);
                } else {
                    console.log('Registration email sent successfully to:', email);
                }
            } catch (emailError) {
                console.error('Failed to send registration email:', emailError);
                // Don't fail the request if email service is down - user is already created
            }

            return res.status(201).json({
                id: user.id, email: user.email, name: user.name, createdAt: user.createdAt,
            });
        } catch (err) {
            if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
                return res.status(400).json({
                    error: 'Email already exists', code: 'EMAIL_EXISTS',
                });
            }

            console.error('POST /users error:', err);
            return res.status(500).json({
                error: 'Internal server error', code: 'INTERNAL_ERROR',
            });
        }
    });

    return router;
}
