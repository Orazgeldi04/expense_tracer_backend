const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/middleware');
const { createExpense, getExpenses, updateExpense, deleteExpense, exportExpenses } = require('../controllers/expenseController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       required:
 *         - amount
 *         - category
 *         - date
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the expense
 *         amount:
 *           type: number
 *           format: float
 *           description: The amount of the expense
 *         category:
 *           type: string
 *           description: The category of the expense
 *         description:
 *           type: string
 *           description: Description of the expense
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the expense
 *         user_id:
 *           type: integer
 *           description: The ID of the user who created the expense
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
 *         amount: 25.50
 *         category: "Food"
 *         description: "Lunch at restaurant"
 *         date: ""
 *         user_id: 1
 *         created_at: "2023-05-15T12:00:00.000Z"
 *         updated_at: "2023-05-15T12:00:00.000Z"
 */

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *             example:
 *               amount: 25.50
 *               category: "Food"
 *               description: "Lunch at restaurant"
 *               date: ""
 *     responses:
 *       201:
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, createExpense);

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses with filtering and sorting
 *     tags: [Expenses]
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category to filter by
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum amount to filter by
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum amount to filter by
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, amount]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, getExpenses);

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update an existing expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The expense ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *             example:
 *               amount: 30.00
 *               category: "Food"
 *               description: "Dinner at restaurant"
 *               date: ""
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, updateExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The expense ID
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, deleteExpense);

/**
 * @swagger
 * /api/expenses/export/csv:
 *   get:
 *     summary: Export expenses as CSV
 *     tags: [Expenses]
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
 *         description: CSV file of expenses
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get('/export/csv', authenticateToken, exportExpenses);

module.exports = router;