/**
 * AccessTokenService interface
 *
 * Implementations must provide:
 *  - sign(sub: string, email: string) => string
 *
 * Notes:
 *  - `sub` is the subject (user id).
 *  - `email` is the user’s email.
 *  - `sign` returns a token string.
 *
 * Example implementations:
 *  - accessTokenService.jwt.js : uses RS256 JWT
 *  - jwtTokenService.mock.js: returns base64url encoded payload (for tests)
 */
class AccessTokenService {
    /**
     * @param {string} _sub - subject (user id)
     * @param {string} _email - user email
     * @returns {string} token string
     */
    sign(_sub, _email) {
        throw new Error('Not implemented');
    }
}

/**
 * Error raised when token signing fails
 */
class UnableToSignTokenError extends Error {
    constructor(message = 'Unable to sign token') {
        super(message);
        this.name = 'UnableToSignTokenError';
        this.code = 'UNABLE_TO_SIGN_TOKEN';
    }
}

module.exports = {
    AccessTokenService,
    UnableToSignTokenError,
};