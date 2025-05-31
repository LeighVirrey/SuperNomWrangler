const sql = require('mssql');
require('dotenv').config();
//FOR TESTING PURPOSES, use it as a demonstration

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
}

//the pool gets the connection to the database and is used for all queries

const getPool = async () => {
    if (!global.pool) {
        global.pool = await sql.connect(config);
    }
    return global.pool;
}

// async function testDb(){
//     const pool = await getPool();
//     const result = await pool.request().query('SELECT * FROM Users');
//     console.log(result.recordset);
// }
// testDb();



/**
 * executeQuery takes in the query string and params and just executes the query, that's it
 * this ensures generalization for the classes that call this function
 * @params query - the query string to be executed
 * @params params - the parameters for the query, defaults to an empty object
 * @returns - the results of the query back to the class
 */
module.exports = {
    executeQuery: async (query, params = {}) => {
        const pool = await getPool();
        const request = pool.request();

        // Add parameters to the request
        for (const key in params) {
            request.input(key, params[key]);
        }

        const result = await request.query(query);
        return result.recordset;
    }
}