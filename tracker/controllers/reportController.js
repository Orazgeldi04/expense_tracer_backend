const pool = require('../config/database');


const getSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { start, end } = req.query;

        let query = `
      SELECT category, SUM(amount) as total
      FROM expenses
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

        query += ' GROUP BY category ORDER BY total DESC';

        const result = await pool.query(query, params);

        const summary = {};
        result.rows.forEach(row => {
            summary[row.category] = parseFloat(row.total);
        });

        res.json(summary);
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
};


const getMonthlyReport = async (req, res) => {
    try {
        const { year, 'year-month': month } = req.query;
        const userId = req.user.id;

        if (!year && !month) {
            return res.status(400).json({ error: "Provide 'year' or 'month' (e.g., year=2025 or month=2025-01)" });
        }

        let query = `
            SELECT TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM') AS month,
                   SUM(amount) AS total
            FROM expenses
            WHERE user_id = $1
        `;
        const params = [userId];

        if (month) {

            query += ` AND TO_CHAR(date, 'YYYY-MM') = $2`;
            params.push(month);
        } else {

            query += ` AND EXTRACT(YEAR FROM date) = $2`;
            params.push(parseInt(year));
        }

        query += ` GROUP BY DATE_TRUNC('month', date) ORDER BY month;`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
};

const getTopSpending = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 5, start, end } = req.query;

        let query = `
      SELECT category, SUM(amount) as total
      FROM expenses
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

        query += `
      GROUP BY category 
      ORDER BY total DESC 
      LIMIT $${paramCount + 1}
    `;
        params.push(parseInt(limit));

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching top spending:', error);
        res.status(500).json({ error: 'Failed to fetch top spending' });
    }
};

module.exports = {
    getSummary,
    getMonthlyReport,
    getTopSpending
};