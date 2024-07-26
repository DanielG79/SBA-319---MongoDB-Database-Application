const express = require('express');
const router = express.Router();

const locations = [
    { id: 1, depLoc: "Asgard", zip: 111111 },
    { id: 2, depLoc: "Seattle", zip: 22222 },
    { id: 3, depLoc: "New York", zip: 33333 },
    { id: 4, depLoc: "Tokyo", zip: 44444 },
    { id: 5, depLoc: "Madrid", zip: 55555 }
];

// Get all locations --- Create GET routes
router.get('/', (req, res) => {
    res.json(locations);
});

// GET a single location by ID
router.get('/:id', (req, res) => {
    const locationId = parseInt(req.params.id);
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json(location);
});

// POST a new location --- Create POST routes
router.post('/', (req, res) => {
    const { depLoc, zip } = req.body;
    const newLocation = {
        id: locations.length + 1,
        depLoc,
        zip,
    };
    locations.push(newLocation);
    res.status(201).json(newLocation);
});

// PATCH/PUT (update) a location by ID --- Create PATCH or PUT routes for data
router.put('/:id', (req, res) => {
    const locationId = parseInt(req.params.id);
    const locationIndex = locations.findIndex(loc => loc.id === locationId);
    if (locationIndex === -1) return res.status(404).json({ error: 'Location not found' });

    locations[locationIndex] = {
        ...locations[locationIndex],
        depLoc: req.body.depLoc || locations[locationIndex].depLoc,
        zip: req.body.zip || locations[locationIndex].zip
    };
    res.json(locations[locationIndex]);
});

// DELETE a location by ID --- Create DELETE routes for data
router.delete('/:id', (req, res) => {
    const locationId = parseInt(req.params.id);
    const locationIndex = locations.findIndex(loc => loc.id === locationId);
    if (locationIndex === -1) return res.status(404).json({ error: 'Location not found' });

    const deletedLocation = locations.splice(locationIndex, 1)[0];
    res.json(deletedLocation);
});

module.exports = router;