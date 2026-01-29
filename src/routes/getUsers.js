const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @openapi
 * /api/auth/users/{userId}:
 *   get:
 *     summary: Get user info
 *     tags: 
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of user to get
 *     responses:
 *       200:
 *         description: User data successfully fetched
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
 * /api/auth/users:
 *   get:
 *     summary: Get all users info
 *     tags: 
 *       - Users
 *     responses:
 *       200:
 *         description: Users data successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     properties:
 *                      id:
 *                        type: string
 *                        format: uuid
 *                      email:
 *                        type: string
 *                        format: email
 *                      userName:
 *                        type: string
 */
router.get('/', async (req, res) => {
    return res.status(404).json({
        error: "dead endpoint"
    })
});

router.get('/:userId', async (req, res) => {
    return res.status(404).json({
        error: "dead endpoint"
    })
});

module.exports = router;