/**
 * UserService interface
 *
 * Implementations must provide:
 *  - getMe(email: string, password: string) => Promise<{id, email, created_at}>
 */
class UserService {
    /**
     * @param {string} _email
     * @param {string} _password
     * @returns {Promise<{id: string, email: string, created_at: string}>}
     */
    async getMe(_email, _password) {
        throw new Error('Not implemented');
    }
}

/**
 * Error when user is not found
 */
class UserNotFoundError extends Error {
    constructor(message = 'User not found') {
        super(message);
        this.name = 'UserNotFoundError';
        this.code = 'USER_NOT_FOUND';
    }
}

/**
 * Error when password is wrong
 */
class WrongPasswordError extends Error {
    constructor(message = 'Wrong password') {
        super(message);
        this.name = 'WrongPasswordError';
        this.code = 'WRONG_PASSWORD';
    }
}

module.exports = {
    UserService,
    UserNotFoundError,
    WrongPasswordError,
};