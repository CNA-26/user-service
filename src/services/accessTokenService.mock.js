const base = require('./accessTokenService');

module.exports = () => {
    class MockAccessTokenService extends base.AccessTokenService {
        sign(sub, email) {
            const payload = {sub, email};
            return Buffer.from(JSON.stringify(payload)).toString('base64url');
        }
    }

    return new MockAccessTokenService();
};