const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/middleware');
const { getSummary, getMonthlyReport, getTopSpending } = require('../controllers/reportController');

/**
 * @swagger
 * /api/reports/summary:
 *   get:
 *     summary: Get total expenses by category
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Summary of expenses by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: number
 *                 format: float
 *       500:
 *         description: Server error
 */
router.get('/summary', authenticateToken, getSummary);
/**
 * @swagger
 * /api/reports/monthly:
 *   get:
 *     summary: Get monthly expense summaries
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *           
 *         description: Year to get all monthly summaries
 *       - in: query
 *         name: year-month
 *         required: false
 *         schema:
 *           type: string
 *          
 *           pattern: "^[0-9]{4}-(0[1-9]|1[0-2])$"
 *         description: Specific month in YYYY-MM format
 *     responses:
 *       200:
 *         description: Monthly expense summaries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     example: "2025-03"
 *                   total:
 *                     type: number
 *                     format: float
 *                     example: 1250.75
 *       400:
 *         description: Either 'year' or 'month' is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Provide 'year' or 'month' (e.g., year=2025 or month=2025-01)"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch report"
 */
router.get('/monthly', authenticateToken, getMonthlyReport);
/**
 * @swagger
 * /api/reports/top:
 *   get:
 *     summary: Get top spending categories
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of top categories to return (default 5)
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Top spending categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                   total:
 *                     type: number
 *                     format: float
 *       500:
 *         description: Server error
 */
router.get('/top', authenticateToken, getTopSpending);

module.exports = router;