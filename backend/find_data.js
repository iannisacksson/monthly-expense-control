const { Client } = require('pg');
async function main() {
  const client = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'docker' });
  try {
    await client.connect();
    const query = "SELECT m.user_id, m.id as month_id, m.month, m.year, c.id as category_id " +
                  "FROM months m " +
                  "JOIN categories c ON c.family_id = m.family_id " +
                  "WHERE m.user_id IS NOT NULL " +
                  "ORDER BY m.user_id, m.year DESC, m.month DESC";
    const res = await client.query(query);
    const userGroups = {};
    res.rows.forEach(row => {
      if (!userGroups[row.user_id]) userGroups[row.user_id] = { months: [], categories: new Set() };
      userGroups[row.user_id].months.push({ id: row.month_id, month: row.month, year: row.year });
      userGroups[row.user_id].categories.add(row.category_id);
    });
    for (const userId in userGroups) {
      const group = userGroups[userId];
      if (group.months.length > 1 && group.categories.size > 0) {
        const startMonth = group.months[0];
        const categoryId = Array.from(group.categories)[0];
        console.log(JSON.stringify({ user_id: userId, month_id: startMonth.id, category_id: categoryId }, null, 2));
        return;
      }
    }
  } catch (err) { console.error(err); } finally { await client.end(); }
}
main();
