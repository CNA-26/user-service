const express = require('express');
const {InvalidRefreshTokenError} = require('../services/refreshTokenService');

module.exports = (container) => {
    const router = express.Router();
    const logoutHandler = require('../handlers/logoutHandler')(container);

    /**
     * @openapi
     * /api/auth/logout:
     *   post:
     *     summary: Log out user
     *     description: Invalidates a refresh token and logs the user out
     *     operationId: logout
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
     *                 description: Refresh token to invalidate
     *     responses:
     *       200:
     *         description: Successfully logged out
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *       401:
     *         description: Invalid or already revoked refresh token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 code:
     *                   type: string
     *                   example: INVALID_REFRESH_TOKEN
     *                 error:
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
     *                   example: refreshToken is required
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 code:
     *                   type: string
     *                   example: INTERNAL_ERROR
     *                 error:
     *                   type: string
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