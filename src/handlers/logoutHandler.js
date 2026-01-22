const {InvalidRefreshTokenError} = require('../services/refreshTokenService');

module.exports = (container) => {
    const refreshTokenService = container.get('refreshTokenService');

    return {
        /**
         * Logout user — invalidate a refresh token
         * @param {string} refreshToken
         * @returns {Promise<{success: boolean}>}
         */
        async logout(refreshToken) {
            await refreshTokenService.delete(refreshToken);
        },
    };
};