import mysql from 'mysql2/promise';

/**
 * Conexión a la base de datos SQL local (Laragon) usando un Pool.
 * El pool permite reutilizar conexiones en lugar de abrir una nueva cada vez,
 * lo que es vital para el rendimiento de las API Routes en Next.js.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ayresiot_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
