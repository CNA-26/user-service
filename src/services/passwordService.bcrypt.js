const { PasswordService } = require('./passwordService');
const bcrypt = require('bcrypt');

const saltRounds = 10;

class BcryptPasswordService extends PasswordService {
    /**
     * Returns hashed password
     * @param {string} password 
     * @returns string
     */
    hash(password) {
        return bcrypt.hash(password, saltRounds);
    }
    /**
     * Compares password and hashedPassword, returns true if they match
     * @param {string} password 
     * @param {string} passwordHash
     * @returns {boolean} 
     */
    async compare(password, passwordHash) {
        try {
            return await bcrypt.compare(password, passwordHash);
        } catch (err) {
            return false;
        }
    }
}

module.exports = {
    BcryptPasswordService,
};