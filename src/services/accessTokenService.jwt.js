const jwt = require('jsonwebtoken');
const {
    AccessTokenService, UnableToSignTokenError, InvalidAccessTokenError,
} = require('./accessTokenService');

module.exports = () => {
    const secret = process.env.JWT_SECRET || 'super-secret-key';

    const issuer = process.env.JWT_ISSUER || 'user-auth';
    const audience = process.env.JWT_AUDIENCE || 'user-frontend';
    const expiresIn = process.env.JWT_EXPIRES || '2m';

    class JwtAccessTokenService extends AccessTokenService {
        sign(sub, email) {
            try {
                return jwt.sign({sub, email}, secret, {
                    algorithm: 'HS256', issuer, audience, expiresIn,
                });
            } catch (err) {
                throw new UnableToSignTokenError(err.message);
            }
        }

        verify(token) {
            try {
                const payload = jwt.verify(token, secret, {
                    issuer, audience,
                });

                return {
                    sub: payload.sub, email: payload.email,
                };
            } catch (err) {
                throw new InvalidAccessTokenError(err.message);
            }
        }
    }

    return new JwtAccessTokenService();
};