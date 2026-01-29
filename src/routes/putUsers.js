const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @openapi
 * /api/auth/users:
 *   put:
 *     summary: Update user info
 *     tags: 
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - email
 *               - userName
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               email:
 *                 type: string
 *                 format: email
 *               userName:
 *                 type: string
 *                 example: NewUserName123
 *     responses:
 *       200:
 *         description: User data updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 email:
 *                   type: string
 *                   format: email
 *                 userName:
 *                   type: string
 *                   example: NewUserName123
 */
router.put('/', async (req, res) => {
    return res.status(404).json({
        error: "dead endpoint"
    })
});

module.exports = router;