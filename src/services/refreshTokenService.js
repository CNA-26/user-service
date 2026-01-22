/**
 * RefreshTokenService interface
 *
 * Implementations must provide:
 *  - generate(userId: string) => Promise<{ token: string, expiresAt: Date }>
 *  - refresh(oldToken: string) => Promise<{ token: string, expiresAt: Date }>
 */
class RefreshTokenService {
    /**
     * @param {string} _userId
     * @returns {Promise<{ token: string, userId: string, email: string}>}
     */
    async generate(_userId) {
        throw new Error('Not implemented');
    }

    /**
     * @param {string} _oldToken
     * @returns {Promise<{ token: string, expiresAt: Date }>}
     */
    async refresh(_oldToken) {
        throw new Error('Not implemented');
    }

    /**
     * @param {string} _token
     * @returns {Promise<void>}
     */
    async delete(_token) {
        throw new Error('Not implemented');
    }
}

/**
 * Error raised when refresh token generation fails
 */
class UnableToGenerateRefreshTokenError extends Error {
    constructor(message = 'Unable to generate refresh token') {
        super(message);
        this.name = 'UnableToGenerateRefreshTokenError';
        this.code = 'UNABLE_TO_GENERATE_REFRESH_TOKEN';
    }
}

/**
 * Error raised when refresh token is invalid or expired
 */
class InvalidRefreshTokenError extends Error {
    constructor(message = 'Invalid or expired refresh token') {
        super(message);
        this.name = 'InvalidRefreshTokenError';
        this.code = 'INVALID_REFRESH_TOKEN';
    }
}

module.exports = {
    RefreshTokenService,
    UnableToGenerateRefreshTokenError,
    InvalidRefreshTokenError,
};