const { PasswordService } = require('./passwordService');

class MockPasswordService extends PasswordService {
    hash(password) {
        console.log(`[MockPasswordService] hash called with: ${password}`);
        return 'hashedPassword';
    }
}

module.exports = {
    MockPasswordService,
};