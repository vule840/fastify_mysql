const dotenv = require('dotenv');
// Load the correct environment file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile });
// Log the current NODE_ENV
//console.log('Current NODE_ENV:', process.env.NODE_ENV);
// db/userModel.js

// Log which environment file is being loaded
//console.log('Loading environment file:', envFile);
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const getConnection = async () => {
    return await pool.getConnection()
}

const getAllUsers = async () => {
    /*     console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD); */
    const connection = await getConnection()
    //const [rows] = await connection.execute('SELECT * FROM users')
    const [rows] = await connection.execute(`
      SELECT u.id AS user_id, u.name AS user_name, u.email AS user_email,
             p.id AS pet_id, p.name AS pet_name, p.type AS pet_type, p.image AS pet_image
      FROM users u
      LEFT JOIN pets p ON u.id = p.user_id
    `)
    
    connection.release()
    return rows
}

const getUserById = async (id) => {

    const connection = await getConnection()
     // Query to get the user and their pets
     const [rows] = await connection.query(`
        SELECT u.id AS user_id, u.name AS user_name, u.email AS user_email,
               p.id AS pet_id, p.name AS pet_name, p.type AS pet_type, p.image AS pet_image
        FROM users u
        LEFT JOIN pets p ON u.id = p.user_id
        WHERE u.id = ?
      `, [id]);
    connection.release()
    return rows
}

const createUser = async (name, email) => {
    const connection = await getConnection()
    const [rows] = await connection.execute('INSERT INTO users (name,email) VALUES (?,?)', [name, email])
    connection.release()
    return rows
}

const updateUser = async (id, name, email) => {
    const connection = await getConnection()
    const [result] = await connection.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id])
    connection.release()
    return result.affectedRows
}

const deleteUser = async (id) => {
    const connection = await getConnection()
    const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id])
    connection.release()
    return result.affectedRows
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    createUser
}