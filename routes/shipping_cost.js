const express = require('express');
const bodyParser = require('body-parser');
const AppDAO = require('../models/app_dao')
const ShippingRepository = require('../models/shipping_repository')

const router = express.Router();
const dao = new AppDAO('./db/database.db')
const shippingRepo = new ShippingRepository(dao)

// Parse JSON bodies
router.use(bodyParser.json());

shippingRepo.createTable()

// Route for adding a cost
router.post('/add-cost', function(req, res) {
    const minWeight = req.body.minWeight;
    const maxWeight = req.body.maxWeight;
    const cost = req.body.cost;

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
router.post('/remove-cost', function(req, res) {
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
router.get('/get-costs', function(req, res) {
    // Get all costs from the database
    //shippingRepo.getAll()
    shippingRepo.sort()
        .then((costs) => {
            // Send the costs back to the client
            res.json(costs);
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error getting costs' });
        });
});

router.post('/get-update', function(req,res){



    
})
module.exports = router