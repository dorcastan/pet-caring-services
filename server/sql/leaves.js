const leaves = {};

leaves.queries = {
  apply:
    'INSERT INTO applies_for_leave_period (email, startDate, endDate, isEmergency) VALUES ($1, $2, $3, $4) RETURNING *',
  retrieve: 'SELECT * FROM applies_for_leave_period WHERE email = $1 ORDER BY startDate DESC',
};

module.exports = leaves;
