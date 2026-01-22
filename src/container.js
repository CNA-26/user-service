const createContainer = () => {
    const services = {};

    // Access token service: real vs mock
    if (process.env.USE_MOCK_TOKEN === 'true') {
        services.accessTokenService = require('./services/accessTokenService.mock')();
    } else {
        services.accessTokenService = require('./services/accessTokenService.jwt')();
    }

    // User service: mock vs http
    const choice = (process.env.NOTES_BACKEND || 'db').toLowerCase();
    if (choice === 'db') {
        services.userService = require('./services/userService.db');
    } else {
        services.userService = require('./services/userService.mock')();
    }

    const rtChoice = (process.env.REFRESH_BACKEND || 'db').toLowerCase();
    if (rtChoice === 'mock') {
        const { MockRefreshTokenService } = require('./services/refreshTokenService.mock');
        services.refreshTokenService = new MockRefreshTokenService();
    } else {
        const { DbRefreshTokenService } = require('./services/refreshTokenService.db');
        services.refreshTokenService = new DbRefreshTokenService();
    }

    return {
        get(name) {
            const svc = services[name];
            if (!svc) throw new Error(`Service not found: ${name}`);
            return svc;
        }
    };
};

module.exports = {createContainer};
