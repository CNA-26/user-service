const {
    AccessTokenService, InvalidAccessTokenError,
} = require('./accessTokenService');

module.exports = () => {
    class MockAccessTokenService extends AccessTokenService {
        sign(sub, email) {
            const payload = {sub, email};
            return Buffer.from(JSON.stringify(payload)).toString('base64url');
        }

        verify(token) {
            try {
                const json = Buffer.from(token, 'base64url').toString('utf8');
                return JSON.parse(json);
            } catch (err) {
                throw new InvalidAccessTokenError('Invalid mock access token');
            }
        }
    }

    return new MockAccessTokenService();
};