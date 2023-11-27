const express = require('express');
const bodyParser = require('body-parser');
const AppDAO = require('./models/app_dao')
const ShippingRepository = require('./models/shipping_repository')

const app = express();
const dao = new AppDAO('./db/database.db')
const shippingRepo = new ShippingRepository(dao)

// Parse JSON bodies
app.use(bodyParser.json());

// Route for adding a cost
app.post('/add-cost', function(req, res) {
    const minWeight = req.body.minWeight;
    const maxWeight = req.body.maxWeight;
    const cost = req.body.cost;

    // Insert the new weight and cost into the database
    shippingRepo.create(minWeight, maxWeight, cost)
        .then(() => {

            // Send a response back to the client
            res.json({ message: 'new Cost added successfully' });
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error adding cost' });
        });
});


// Route for removing a cost
app.post('/remove-cost', function(req, res) {
    const id = req.body.id;

    // Remove the weight and cost from the database
    shippingRepo.delete(id)
        .then(() => {
            // Send a response back to the client
            res.json({ message: 'Cost removed successfully' });
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error removing cost' });
        });
});

// Route for getting all costs
app.get('/get-costs', function(req, res) {
    // Get all costs from the database
    shippingRepo.getAll()
        .then((costs) => {
            // Send the costs back to the client
            res.json(costs);
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error getting costs' });
        });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
