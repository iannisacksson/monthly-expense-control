const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'docker',
  port: 5432,
});

async function main() {
  try {
    await client.connect();
    
    const columnsQuery = `
      SELECT column_name, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'recurring_incomes' AND column_name = 'family_id';
    `;
    
    const constraintsQuery = `
      SELECT
          tc.constraint_name, tc.constraint_type, kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
      FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_name='recurring_incomes' AND kcu.column_name='family_id';
    `;

    const resCols = await client.query(columnsQuery);
    console.log('--- Column Info ---');
    console.table(resCols.rows);

    const resCons = await client.query(constraintsQuery);
    console.log('--- Constraint Info ---');
    console.table(resCons.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
