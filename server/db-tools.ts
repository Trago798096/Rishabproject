import pkg from 'pg';
const { Pool } = pkg;

// Create a PostgreSQL client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Execute SQL
export async function execute_sql_tool(sql: string) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(sql);
      return result;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error executing SQL:', error);
    throw error;
  }
}