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

module.exports = {
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

};

