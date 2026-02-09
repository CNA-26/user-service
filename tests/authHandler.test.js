const createAuthHandler = require('../../user-service/src/handlers/authHandler');
const createMockUserService = require('../../user-service/src/services/userService.mock');
const createMockAccessTokenService = require('../../user-service/src/services/accessTokenService.mock');
const {MockRefreshTokenService} = require('../../user-service/src/services/refreshTokenService.mock');
const {UserNotFoundError, WrongPasswordError} = require('../../user-service/src/services/userService');

describe('authHandler.signIn', () => {
    let authHandler;

    beforeEach(() => {
        // mock DI container
        const container = {
            get(name) {
                if (name === 'userService') return createMockUserService();
                if (name === 'accessTokenService') return createMockAccessTokenService();
                if (name === 'refreshTokenService') return new MockRefreshTokenService();
                throw new Error(`Unknown service: ${name}`);
            },
        };

        authHandler = createAuthHandler(container);
    });

    test('returns token for valid credentials', async () => {
        const result = await authHandler.signIn('test@test.com', '12345');
        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');
        expect(typeof result.accessToken).toBe('string');
        expect(typeof result.refreshToken).toBe('string');
    });

    test('throws UserNotFoundError for invalid email', async () => {
        await expect(authHandler.signIn('other@example.com', '12345'))
            .rejects.toBeInstanceOf(UserNotFoundError);
    });

    test('throws WrongPasswordError for invalid password', async () => {
        await expect(authHandler.signIn('test@test.com', 'wrongpass'))
            .rejects.toBeInstanceOf(WrongPasswordError);
    });
});