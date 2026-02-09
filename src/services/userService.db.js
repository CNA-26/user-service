const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const { UserService, UserNotFoundError, WrongPasswordError } = require('./userService');

const prisma = new PrismaClient();

class DbUserService extends UserService {
    /**
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{id: string, email: string, created_at: string}>}
     */
    async getMe(email, password) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UserNotFoundError();
        }

        // Check password
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            throw new WrongPasswordError();
        }

        // Return normalized object
        return {
            id: user.id, email: user.email, created_at: user.createdAt, role: user.role,
        };
    }
}

module.exports = new DbUserService();