const sql = require('mssql');
const { default: test } = require('node:test');

//FOR TESTING PURPOSES, use it as a demonstration

const getPool = async () => {
    //this connects to a local database, once we get Azure up we can connect the URI they give instead.
    if (!global.pool) {
        //mssql node documentation example
        global.pool = await sql.connect({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_SERVER,
            database: process.env.DB_NAME,
            options: {
                encrypt: true, // Use this if you're on Windows Azure
                trustServerCertificate: true // Change to true for local dev / self-signed certs
            }
        });
    }
    return global.pool;
    }

const createLocalDB = async () => {
    const pool = await getPool();
    await pool.request().query(`CREATE DATABASE TestNomDB`);
    await pool.request().query(`USE TestNomDB`);
    await pool.request().query(`
        CREATE TABLE Users (
            id INT PRIMARY KEY IDENTITY(1,1),
            name NVARCHAR(100),
            email NVARCHAR(100)
        )
    `);


    //THIS IS AN EXAMPLE, future task is to make this general so that we can use it for all tables for when the object calls the DAL
        getUsers: async () => {
            const pool = await getPool();
            const result = await pool.request().query('SELECT * FROM Users');
            return result.recordset;
        }
        getUserById: async (id) => {
            const pool = await getPool();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM Users WHERE id = @id');
            return result.recordset[0];
        }
        createUser: async (user) => {
            const pool = await getPool();
            const result = await pool.request()
                .input('name', sql.NVarChar, user.name)
                .input('email', sql.NVarChar, user.email)
                .query('INSERT INTO Users (name, email) VALUES (@name, @email)');
            return result.rowsAffected[0];
        }
        updateUser: async (id, user) => {
            const pool = await getPool();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('name', sql.NVarChar, user.name)
                .input('email', sql.NVarChar, user.email)
                .query('UPDATE Users SET name = @name, email = @email WHERE id = @id');
            return result.rowsAffected[0];
        }
        deleteUser: async (id) => {
            const pool = await getPool();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Users WHERE id = @id');
            return result.rowsAffected[0];
        }
    }