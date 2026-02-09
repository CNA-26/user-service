/**
 * AccessTokenService interface
 *
 * Implementations must provide:
 *  - sign(sub: string, email: string) => string
 *  - verify(token: string) => { sub: string, email: string }
 */
class AccessTokenService {
    /**
     * @param {string} _sub
     * @param {string} _email
     * @returns {string}
     */
    sign(_sub, _email) {
        throw new Error('Not implemented');
    }

    /**
     * @param {string} _token
     * @returns {{ sub: string, email: string }}
     */
    verify(_token) {
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

class InvalidAccessTokenError extends Error {
    constructor(message = 'Invalid access token') {
        super(message);
        this.name = 'InvalidAccessTokenError';
        this.code = 'INVALID_ACCESS_TOKEN';
    }
}

module.exports = {
    AccessTokenService, UnableToSignTokenError, InvalidAccessTokenError,
};