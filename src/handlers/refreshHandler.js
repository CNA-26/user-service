module.exports = (container) => {
    const accessTokenService = container.get('accessTokenService');
    const refreshTokenService = container.get('refreshTokenService');

    return {
        /**
         * Refresh the access token using a valid refresh token
         * @param {string} refreshToken
         * @returns {Promise<{accessToken: string, refreshToken: string}>}
         */
        async refresh(refreshToken) {
            // Exchange old refresh token for a new one
            const {token: newRefreshToken, userId, email} = await refreshTokenService.refresh(refreshToken);

            const newAccessToken = accessTokenService.sign(userId, email);

            return {
                accessToken: newAccessToken, refreshToken: newRefreshToken,
            };
        },
    };
};