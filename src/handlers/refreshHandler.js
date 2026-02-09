module.exports = (container) => {
    const accessTokenService = container.get('accessTokenService');
    const refreshTokenService = container.get('refreshTokenService');
    const userService = container.get('userService');

    return {
        /**
         * Refresh the access token using a valid refresh token
         * @param {string} refreshToken
         * @returns {Promise<{accessToken: string, refreshToken: string}>}
         */
        async refresh(refreshToken) {
            // Exchange old refresh token for a new one
            const { token: newRefreshToken, userId, email } = await refreshTokenService.refresh(refreshToken);

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    role: true,
                },
            });
            const role = user.role || "USER";

            const newAccessToken = accessTokenService.sign(userId, email, role);

            return {
                accessToken: newAccessToken, refreshToken: newRefreshToken,
            };
        },
    };
};