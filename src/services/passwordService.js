/**
 * PasswordService interface
 * 
 * Implementations must provide:
 * - hash(password: string) => string
 * - compare(password: string, passwordHash: string) -> string
 */
class PasswordService {
    /**
     * @param {string} _password 
     * @returns {string}
     */
    hash(_password) {
        throw new Error('Not implemented');
    }
    /**
     * @param {string} _password 
     * @param {string} _passwordHash 
     * @returns {boolean}
     */
    compare(_password, _passwordHash) {
        throw new Error('Not implemented');
    }
}

module.exports = {
    PasswordService,
};