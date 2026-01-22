module.exports = (container) => {
    const accessTokenService = container.get('accessTokenService');
    const refreshTokenService = container.get('refreshTokenService');
    const userService = container.get('userService');

    return {
        async signIn(email, password) {
            // Ask backend for user info
            const userInfo = await userService.getMe(email, password);

            // User userInfo as a sub
            const sub = userInfo.id;
            const accessToken = accessTokenService.sign(sub, email);

            const {token: refreshToken} = await refreshTokenService.generate(sub);

            return {
                accessToken, refreshToken,
            };
        },
    };
};