/**
 * PasswordService interface
 * 
 * Implementations must provide:
 * - hash(password: string) => string
 */
class PasswordService {
    /**
     * @param {string} _password 
     * @returns {string}
     */
    hash(_password) {
        throw new Error('Not implemented');
    }
}

module.exports = {
    PasswordService,
};