const express = require('express');
const bodyParser = require('body-parser');
const AppDAO = require('../models/app_dao')
const ShippingRepository = require('../models/shipping_repository')

const router = express.Router();
const dao = new AppDAO('./db/database.db')
const shippingRepo = new ShippingRepository(dao)

// Parse JSON bodies
router.use(bodyParser.json());

// Create shipping table
// Add default value for free shipping
shippingRepo.createTable()
    .then(() => {
        return shippingRepo.getAll();
    })
    .then((costs) => {
        if (costs.length === 0) {
            return shippingRepo.create(0, 1, 0);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });



// Route for adding a cost
router.post('/add-cost', function (req, res) {
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
router.post('/remove-cost', async function (req, res) {
    const id = req.body.id;

    try {
        let costs = await shippingRepo.getAll();
        let costToRemove;
        for (const cost of costs) {
            if (cost.id == id) {
                costToRemove = cost;
                break;
            }
        }
        if (!costToRemove) {
            throw new Error('Cost not found');
        }
        const currentMin = costToRemove.minWeight;
        // Remove the cost from the database
        await shippingRepo.delete(id);

        // Find the cost to update
        const costToUpdate = costs.find(cost => cost.minWeight === costToRemove.maxWeight);
        if (costToUpdate) {
            await shippingRepo.update(costToUpdate.id, currentMin, costToUpdate.maxWeight, costToUpdate.cost);
        }

        // Send a response back to the client, including the removed cost
        res.json({ message: 'Cost removed successfully', removedCost: costToRemove });
    } catch (error) {
        console.error('Error removing cost:', error);
        res.status(500).json({ message: 'Error removing cost' });
    }
});




// Route for getting all costs
router.get('/get-costs', function (req, res) {

    // Get all costs from the database
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

router.post('/get-update', async function (req, res) {
    const maxWeight = parseInt(req.body.maxWeight);

    try {
        const costs = await shippingRepo.getAll();

        let maxWeightFound = 0;
        let nextCost = null;

        // Looping to find the number that the user entered is within range
        for (const cost of costs) {
            if (cost.maxWeight < maxWeight && cost.maxWeight > maxWeightFound) {
                maxWeightFound = cost.maxWeight;
            }

            // nextCost stores cost data so it's able to update minWeight
            if (cost.minWeight < maxWeight && cost.maxWeight > maxWeight) {
                nextCost = cost;
            }

            // Check if entered weight matches either minWeight or maxWeight
            if (cost.minWeight === maxWeight || cost.maxWeight === maxWeight) {
                // If it matches, return without updating the database
                res.json({ minWeight: cost.minWeight });
                return;
            }
        }

        const minWeight = maxWeightFound || 0;

        if (nextCost) {
            await shippingRepo.update(nextCost.id, maxWeight, nextCost.maxWeight, nextCost.cost);
        }

        res.json({ minWeight });
    } catch (error) {
        console.error('Error updating maxWeight:', error);
        res.status(500).json({ message: 'Error updating maxWeight' });
    }
});



module.exports = router;
