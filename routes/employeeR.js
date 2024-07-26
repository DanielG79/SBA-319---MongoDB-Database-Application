// route handlers 

const express = require('express');
const router = express.Router();
//const employeesData = require('../utilities-data/employees')


const employees = [
    { id: 1, name: "Adam Smith", hireYear: 2020, title: "QA Engineer" },
    { id: 2, name: "Olivia Johnson", hireYear: 2017, title: "HR Specialist" },
    { id: 3, name: "Julie Bolder", hireYear: 2022, title: "Payroll Specialist" },
    { id: 4, name: "Denzel Washington", hireYear: 2011, title: "Chief of Finance" },
    { id: 5, name: "Chris Evans", hireYear: 2008, title: "Captain America" },
    { id: 6, name: "Thor Odinson", hireYear: 2020, title: "God of Thunder" }
];

// Get all employees --- Create GET routes
router.get('/', async (req, res) => {
    res.json(employees);
});

// GET a single employee by ID
router.get('/:id', (req, res) => {
    const employee = employees.find(emp => emp.id === parseInt(req.params.id));
    if (!employee) return res.status(404).send('Employee not found.');
    res.json(employee);
});

// POST a new employee --- Create POST routes
router.post('/', async (req, res) => {
    try {
        const newEmployee = {
            id: req.body.id,
            name: req.body.name,
            hireYear: req.body.hireYear,
            title: req.body.title
        };

        const result = await db.collection('employees').insertOne(newEmployee);
        res.send("New employee has been added.");
    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).send('Error adding employee');
    }
});

// PATCH/PUT (update) an employee by ID --- Create PATCH or PUT routes for data
router.put('/:id', async (req, res) => {
    try {
        const employeeId = parseInt(req.params.id);
        const updatedEmployee = {
            $set: {
                id: req.body.id,
                name: req.body.name,
                hireYear: req.body.hireYear,
                title: req.body.title
            }
        };
        const result = await db.collection('employees').updateOne({ id: employeeId }, updatedEmployee);
        res.send("Employee data updated.");
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).send('Error updating employee');
    }
});

// DELETE an employee by ID --- Create DELETE routes for data
router.delete('/:id', async (req, res) => {
    try {
        const employeeId = parseInt(req.params.id);
        const result = await db.collection('employees').deleteOne({ id: employeeId });
        res.send('Employee deleted');
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).send('Error deleting employee');
    }
});

module.exports = router; // Export the router instance