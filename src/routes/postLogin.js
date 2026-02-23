const express = require('express');
const {
    UserNotFoundError, WrongPasswordError,
} = require('../services/userService');
const {UnableToSignTokenError} = require('../services/accessTokenService');

module.exports = (container) => {
    const router = express.Router();
    const authHandler = require('../handlers/authHandler')(container);

    /**
     * @openapi
     * /api/auth/login:
     *   post:
     *     summary: Sign in and get a JWT token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: JWT token and user info
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 accessToken:
     *                   type: string
     *                 refreshToken:
     *                   type: string
     */
    router.post('/', async (req, res) => {
        const {email, password} = req.body || {};

        // Validate input here
        if (!email || !password) {
            return res.status(422).json({error: 'Email and password are required'});
        }

        try {
            const result = await authHandler.signIn(email, password);
            res.json(result);
        } catch (err) {
            if (err instanceof UserNotFoundError) {
                return res.status(400).json({code: err.code, error: err.message});
            }
            if (err instanceof WrongPasswordError) {
                return res.status(400).json({code: err.code, error: err.message});
            }
            if (err instanceof UnableToSignTokenError) {
                return res.status(500).json({code: err.code, error: err.message});
            }

            console.error('Unexpected error in /auth/login:', err);
            res.status(500).json({code: 'INTERNAL_ERROR', error: 'Internal server error'});
        }
    });

    return router;
};
