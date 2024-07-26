// import { MongoClient } from 'mongodb'; // To load an ES module, set "type": "module" in the package.json or use the .mjs extension.

const express = require('express');
const { MongoClient } = require('mongodb');
const employeeR = require('./routes/employeeR');
const locationR = require('./routes/locationR');
const timeOffR = require('./routes/timeoffR');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function main() {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();
        console.log('Connected to MongoDB');

        //Middleware
        app.use(express.json());

        //Routes
        app.use('/employees', employeeR);           // employees router
        app.use('/locations', locationR);           // locations router
        app.use('/timeOffRequests', timeOffR);      // time off requests router

        // Populate collections with initial data
        const employeesData = require('./utilities-data/employees');
        const timeOffRequestsData = require('./utilities-data/timeOffRequests');
        const locationsData = require('./utilities-data/locations');

        await db.collection('employees').insertMany(employeesData);
        await db.collection('timeOffRequests').insertMany(timeOffRequestsData);
        await db.collection('locations').insertMany(locationsData);

        // Global error handling
        app.use((err, _req, res, _next) => {
            console.error(err);
            res.status(500).send('Seems like there is an error.');
        });

        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

main();