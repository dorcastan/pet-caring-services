const db = require('../db');

exports.index = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Caretaker');
    res.json({ totalCount: result.rowCount, entries: result.rows });
  } catch (err) {
    console.error(err);
  }
};

exports.view = async (req, res) => {
  const { username } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM AppUser WHERE username = $1 AND $1 IN (SELECT caretakerUsername from Caretaker)',
      [username],
    );
    if (result.rowCount === 0) {
      res.json({ error: 'No such caretaker exists' });
      return; // TODO: next()?
    }
    const user = result.rows[0];
    res.json(user);
  } catch (err) {
    console.error('ERROR: ', err.message);
    res.json({ error: 'An unexpected error occurred' });
  }
};
