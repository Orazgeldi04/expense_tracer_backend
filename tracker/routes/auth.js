const express = require('express');
const router = express.Router();
const { register, login,  deleteProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/middleware');

/**
 * @swagger
 * components:  
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password (hashed)
 *         name:
 *           type: string
 *           description: The user's name
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp
 *       example:
 *         id: 1
 *         email: "user@email.com"
 *         name: "Ata Atayew"
 *         created_at: "2023-05-15T12:00:00.000Z"
 *         updated_at: "2023-05-15T12:00:00.000Z"
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *             example:
 *               email: "user@email.com"
 *               password: "password123"
 *               name: "Ata Atayew"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post('/register',register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: "user@email.com"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login',login);

// /**
//  * @swagger
//  * /api/auth/profile:
//  *   get:
//  *     summary: Get user profile
//  *     tags: [Authentication]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: User profile data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
// router.get('/profile', authenticateToken, getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   delete:
 *     summary: Delete user profile (account)
 *     description: Permanently deletes the authenticated user's account.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User account deleted successfully
 *       401:
 *         description: Unauthorized – Missing or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/profile', authenticateToken, deleteProfile);

module.exports = router;