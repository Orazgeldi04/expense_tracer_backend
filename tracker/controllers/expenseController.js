const pool = require('../config/database');
const { Parser } = require('json2csv');


const createExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const userId = req.user.id;

    const query = `
      INSERT INTO expenses (user_id, amount, category, description, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id, amount, category, description, date
    `;
    const values = [
      userId,
      amount,
      category,
      description,
      date || new Date()];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
};


const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { start, end, category, minAmount, maxAmount, sort = 'date', order = 'desc' } = req.query;

    let query = `
      SELECT * FROM expenses 
      WHERE user_id = $1
    `;
    let params = [userId];
    let paramCount = 1;


    if (start) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(start);
    }

    if (end) {
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(end + ' 23:59:59');
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (minAmount) {
      paramCount++;
      query += ` AND amount >= $${paramCount}`;
      params.push(parseFloat(minAmount));
    }

    if (maxAmount) {
      paramCount++;
      query += ` AND amount <= $${paramCount}`;
      params.push(parseFloat(maxAmount));
    }

    const validSortFields = ['date', 'amount',];
    const sortField = validSortFields.includes(sort) ? sort : 'date';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};


const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { amount, category, description, date } = req.body;

    const query = `
      UPDATE expenses 
      SET amount = $1, category = $2, description = $3, date = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND user_id = $6
      RETURNING *
    `;
    const values = [amount, category, description, date, id, userId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};


const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const query = 'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};


const exportExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { start, end } = req.query;

    let query = `
      SELECT date, amount, category, description 
      FROM expenses 
      WHERE user_id = $1
    `;
    let params = [userId];

    if (start) {
      params.push(start);
      query += ` AND date >= $${params.length}`;
    }

    if (end) {
      params.push(end + ' 23:59:59');
      query += ` AND date <= $${params.length}`;
    }

    query += ' ORDER BY date DESC';

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No expenses found for the given period' });
    }

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(result.rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('expenses.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting expenses:', error);
    res.status(500).json({ error: 'Failed to export expenses' });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  exportExpenses
};