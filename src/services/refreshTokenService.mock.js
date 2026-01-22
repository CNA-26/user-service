const {
    RefreshTokenService,
    InvalidRefreshTokenError,
} = require('./refreshTokenService');

class MockRefreshTokenService extends RefreshTokenService {
    constructor() {
        super();
        this._tokens = new Map(); // token -> { userId, expiresAt }
    }

    async generate(userId) {
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
        const token = Buffer.from(`${userId}:${expiresAt.toISOString()}`).toString('base64url');

        this._tokens.set(token, { userId, expiresAt });

        return { token, userId, email: "test@test.com" };
    }

    async refresh(oldToken) {
        const record = this._tokens.get(oldToken);
        if (!record || record.expiresAt < new Date()) {
            throw new InvalidRefreshTokenError();
        }

        // delete old token
        this._tokens.delete(oldToken);

        // issue new
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
        const newToken = Buffer.from(`${record.userId}:${expiresAt.toISOString()}`).toString('base64url');
        this._tokens.set(newToken, { userId: record.userId, expiresAt });

        return { token: newToken, expiresAt };
    }

    async delete(token) {
        if (!this._tokens.has(token)) {
            throw new InvalidRefreshTokenError();
        }
        this._tokens.delete(token);
    }
}

module.exports = {
    MockRefreshTokenService,
};