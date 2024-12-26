import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./data.db');

// First update all users to admin
db.run('UPDATE users SET is_admin = 1', (err) => {
  if (err) {
    console.error('Error updating admin status:', err);
    process.exit(1);
  }
  console.log('Successfully updated all users to admin');
  
  // Then show all users
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err);
      process.exit(1);
    }
    console.log('\nCurrent users in database:');
    console.table(rows);
    db.close();
  });
}); 