const express = require('express');
const {InvalidRefreshTokenError} = require('../services/refreshTokenService');
const {UnableToSignTokenError} = require('../services/accessTokenService');

module.exports = (container) => {
    const router = express.Router();
    const refreshHandler = require('../handlers/refreshHandler')(container);

    /**
     * @openapi
     * /api/auth/refresh:
     *   post:
     *     summary: Refresh access token using a refresh token
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

        // Validate input
        if (!refreshToken) {
            return res.status(422).json({error: 'refreshToken is required'});
        }

        try {
            const result = await refreshHandler.refresh(refreshToken);
            res.json(result);
        } catch (err) {
            if (err instanceof InvalidRefreshTokenError) {
                return res.status(401).json({code: err.code, error: err.message});
            }
            if (err instanceof UnableToSignTokenError) {
                return res.status(500).json({code: err.code, error: err.message});
            }

            console.error('Unexpected error in /auth/refresh:', err);
            res.status(500).json({code: 'INTERNAL_ERROR', error: 'Internal server error'});
        }
    });

    return router;
};