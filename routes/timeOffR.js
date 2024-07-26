const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');
    const db = client.db();
    timeOffRequests = db.collection('timeOffRequests');
    timeOffRequests.createIndex({ date: 1 }, (err, result) => {
        if (err) {
            console.log("Error creating index:", err);
        } else {
            console.log("Index created on the 'date' field in the 'timeOffRequests' collection", result);
        }
    });
});

const timeOffRequests = [
    { id: 1, date: new Date("2024-01-01"), typeOffRequest: "Personal-Day", hoursADay: 8 },
    { id: 2, date: new Date("2024-03-25"), typeOffRequest: "Vacation", hoursADay: 8 },
    { id: 3, date: new Date("2024-06-10"), typeOffRequest: "Sick Leave", hoursADay: 3 },
    { id: 4, date: new Date("2024-06-10"), typeOffRequest: "Parental Leave", hoursADay: 8 },
    { id: 5, date: new Date("2024-06-10"), typeOffRequest: "Holiday Deferral", hoursADay: 8 }
];

// GET all time off requests
router.get('/', (req, res) => {
    res.json(timeOffRequests);
});

// GET a single time off request by ID
router.get('/:id', (req, res) => {
    const requestId = parseInt(req.params.id);
    const request = timeOffRequests.find(req => req.id === requestId);
    if (!request) return res.status(404).send('Time off request record not found.');
    res.json(request);
});

// POST a new time off request
router.post('/', (req, res) => {
    const newRequest = {
        id: timeOffRequests.length + 1,
        date: req.body.date,
        typeOffRequest: req.body.typeOffRequest,
        hoursADay: req.body.hoursADay
    };
    timeOffRequests.push(newRequest);
    res.send('Time off request record added.');
});

// PUT/PATCH to update an existing time off request
router.put('/:id', (req, res) => {
    const requestId = parseInt(req.params.id);
    const requestIndex = timeOffRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return res.status(404).send('Time off request not found.');

    timeOffRequests[requestIndex] = {
        ...timeOffRequests[requestIndex],
        date: req.body.date || timeOffRequests[requestIndex].date,
        typeOffRequest: req.body.typeOffRequest || timeOffRequests[requestIndex].typeOffRequest,
        hoursADay: req.body.hoursADay || timeOffRequests[requestIndex].hoursADay
    };
    res.send('This time off request was updated.');
});

// DELETE a time off request by ID
router.delete('/:id', (req, res) => {
    const requestId = parseInt(req.params.id);
    const requestIndex = timeOffRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return res.status(404).send('Time off request not found.');

    timeOffRequests.splice(requestIndex, 1);
    res.send('Time off request deleted.');
});

module.exports = router;