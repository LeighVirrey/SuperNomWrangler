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

exports.DAL = {
        executeQuery: async (query, params = {}) => {
        const pool = await getPool();
        const request = pool.request();
        for (const key in params) {
            request.input(key, params[key]);
        }
        const result = await request.query(query);
        return result.recordset;
        },
    getRestaurants: async () => {
        const dummyRestaurants = [
            {
                id: 1,
                name: "Cyan Bistro",
                address: "28 S State St #10, Salt Lake City, UT 84111",
                description: "A vibrant spot known for fresh flavors and a bright atmosphere.",
                distance: 1.2,
                image: '../images/11steakhouse.jpg'
            },
            {
                id: 2,
                name: "Orange Grove",
                address: "150 W 200 S, Salt Lake City, UT 84101",
                description: "Farm-to-table meals with a citrus twist in a cozy setting.",
                distance: 2.7,
                image: '../images/11steakhouse.jpg'
            },
            {
                id: 3,
                name: "Cyan Corner",
                address: "75 N Main St, Salt Lake City, UT 84103",
                description: "A favorite for locals, featuring casual dining and bold dishes.",
                distance: 3.4,
                image: '../images/11steakhouse.jpg'
            },
            {
                id: 4,
                name: "Orange Flame Grill",
                address: "201 E 400 S, Salt Lake City, UT 84111",
                description: "Spicy grilled specialties and warm vibes await you here.",
                distance: 4.1,
                image: '../images/11steakhouse.jpg'
            },
            {
                id: 5,
                name: "Cyan Noodle House",
                address: "390 S State St, Salt Lake City, UT 84111",
                description: "Serving hearty noodle bowls and quick bites at great prices.",
                distance: 5.8,
                image: '../images/11steakhouse.jpg'
            },
        ];

        return dummyRestaurants
    }

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
