const fs = require('fs');
const jwt = require('jsonwebtoken');
const {AccessTokenService, UnableToSignTokenError} = require('./accessTokenService');

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
    }

    return new JwtAccessTokenService();
};