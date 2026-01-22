const {UserNotFoundError, WrongPasswordError, UserService} = require('./userService');

module.exports = () => {
    class MockUserService extends UserService {
        async getMe(email, password) {
            console.log(`[MockUserService] getMe called with:`, {email, password});

            if (email !== 'test@test.com') {
                throw new UserNotFoundError();
            }

            if (password !== '12345') {
                throw new WrongPasswordError();
            }

            return {
                id: '550e8400-e29b-41d4-a716-446655440000',
                email,
                created_at: '2025-09-20 22:05:26.479',
            };
        }
    }

    return new MockUserService();
};