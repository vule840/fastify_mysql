const dotenv = require('dotenv');
// Load the correct environment file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile });

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});


const getConnection = async () => {
    return await pool.getConnection();
  };
const getPets = async (userId) => {
    const connection = await getConnection()
    const [rows] = await connection.query('SELECT * FROM pets');
    connection.release()
    return rows
}

const getPet = async (id) =>{
  const connection = await getConnection()
    const [rows] = await connection.query('SELECT * FROM pets WHERE id = ?', [id]);

    connection.release()
    return rows
}

const createPet = async (name, type, user_id, image) => {
  const connection = await getConnection()
  const [result] = await connection.query('INSERT INTO pets (name, type, user_id, image) VALUES (?,?,?,?)', [name,type,user_id, image]);

  connection.release()
  return result.insertId
}

const updatePet = async (name,type,id) =>{
  const connection = await getConnection()
  const [result] = await connection.query('UPDATE pets SET name = ?, type = ? WHERE id = ?', [name,type,id])

  connection.release()
  return result
}

const deletePet = async (id) => {
  const connection = await getConnection()
  const [result] = await connection.query('DELETE FROM pets WHERE id = ?', [id])

  connection.release()
  return result
}

module.exports = {
    getPets,
    createPet,
    getPet,
    updatePet,
    deletePet
}