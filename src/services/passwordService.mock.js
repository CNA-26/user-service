const { PasswordService } = require('./passwordService');

class MockPasswordService extends PasswordService {
    hash(password) {
        console.log(`[MockPasswordService] hash called with: ${password}`);
        return 'hashedPassword';
    }
    compare(password, passwordHash) {
        console.log(`[MockPasswordService] compare called with: ${password}, ${passwordHash}`);
        if (password === '12345') {
            return true;
        }
        return false;
    }
}

module.exports = {
    MockPasswordService,
};