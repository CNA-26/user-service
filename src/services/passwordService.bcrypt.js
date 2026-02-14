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
}

module.exports = {
    BcryptPasswordService,
};