const {
    RefreshTokenService,
    UnableToGenerateRefreshTokenError,
    InvalidRefreshTokenError,
} = require('./refreshTokenService');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

class DbRefreshTokenService extends RefreshTokenService {
    /**
     * Generate a new refresh token and store it in the DB.
     * @param {string} userId
     * @returns {Promise<{ token: string, userId: string, email: string}>}
     */
    async generate(userId) {
        try {
            const token = crypto.randomBytes(48).toString('hex');
            const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

            const record = await prisma.refreshToken.create({
                data: { token, userId, expiresAt },
                include: { user: true },
            });

            return {
                token: record.token,
                userId: record.userId,
                email: record.user.email,
            };
        } catch (err) {
            console.error('Failed to generate refresh token:', err);
            throw new UnableToGenerateRefreshTokenError();
        }
    }

    /**
     * Exchange an old refresh token for a new one, atomically.
     * @param {string} oldToken
     * @returns {Promise<{ token: string, expiresAt: Date }>}
     */
    async refresh(oldToken) {
        try {
            return await prisma.$transaction(async (tx) => {
                // 1️⃣ Find the existing token
                const existing = await tx.refreshToken.findUnique({
                    where: { token: oldToken },
                });

                if (!existing || existing.expiresAt < new Date()) {
                    throw new InvalidRefreshTokenError();
                }

                // 2️⃣ Delete the old token
                await tx.refreshToken.delete({ where: { token: oldToken } });

                // 3️⃣ Generate and insert the new one
                const newToken = crypto.randomBytes(48).toString('hex');
                const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

                await tx.refreshToken.create({
                    data: {
                        token: newToken,
                        userId: existing.userId,
                        expiresAt,
                    },
                });

                return { token: newToken, expiresAt };
            });
        } catch (err) {
            if (err instanceof InvalidRefreshTokenError) throw err;

            console.error('Failed to refresh token:', err);
            throw new UnableToGenerateRefreshTokenError();
        }
    }

    async delete(token) {
        try {
            await prisma.refreshToken.delete({
                where: {token},
            });
        } catch (err) {
            if (err.code === 'P2025') {
                throw new InvalidRefreshTokenError();
            }
            console.error('Failed to delete refresh token:', err);
            throw err;
        }
    }
}

module.exports = {
    DbRefreshTokenService,
};