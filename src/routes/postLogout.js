const express = require('express');
const {InvalidRefreshTokenError} = require('../services/refreshTokenService');

module.exports = (container) => {
    const router = express.Router();
    const logoutHandler = require('../handlers/logoutHandler')(container);

    /**
     * @openapi
     * /api/auth/logout:
     *   post:
     *     summary: Log out user and invalidate refresh token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - refreshToken
     *             properties:
     *               refreshToken:
     *                 type: string
     */
    router.post('/', async (req, res) => {
        const {refreshToken} = req.body || {};

        if (!refreshToken) {
            return res.status(422).json({error: 'refreshToken is required'});
        }

        try {
            const result = await logoutHandler.logout(refreshToken);
            res.json(result);
        } catch (err) {
            if (err instanceof InvalidRefreshTokenError) {
                // Token already invalid / not found
                return res.status(401).json({code: err.code, error: err.message});
            }

            console.error('Unexpected error in /auth/logout:', err);
            res.status(500).json({code: 'INTERNAL_ERROR', error: 'Internal server error'});
        }
    });

    return router;
};