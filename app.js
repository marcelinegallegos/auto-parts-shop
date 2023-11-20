const express = require('express')
const bodyParser = require('body-parser')
const AppDAO = require('./models/app_dao')
const LegacyDAO = require('./models/legacy_dao')
const PartRepository = require('./models/part_repository')
const OrderRepo = require('./models/order_repository')
const InventoryRepo = require('./models/inventory_repository')
const shopRouter = require('./routes/shop')

const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const partRepo = new PartRepository(legacyDao)
const orderRepo = new OrderRepo(dao)
const inventoryRepo = new InventoryRepo(dao)

const app = express()
var port = process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(express.static('./node_modules/bootstrap/dist/'))
app.use(express.static('./node_modules/bootstrap-icons/'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use("/shop", shopRouter)

app.get('/', (req, res) => {
	res.render('index');
  console.log(req.body.query);
})

app.get('/getParts', (req, res) => {
	partRepo.getAll()
		.then((rows) => {
			res.render('parts.ejs', { rows: rows})
		})
})

app.get('/api/parts', (req, res) => {
	partRepo.getAll()
		.then((rows) => {
			res.json({ rows: rows })
		})
})

app.get('/warehouseHomepage', (req, res) => {
	res.render('warehouseHomepage.ejs');
})

// Route to render the workstation view
app.all('/workstation', (req, res) => {
    orderRepo.getAll()
        .then((list) => {
            res.render('workstation.ejs', {
                all: list
            });
        })
        .catch((error) => {
            console.error('Error fetching orders:', error);
            res.status(500).send('Internal Server Error');
        });
});

// Route to update order status
app.post('/updateOrderStatus/:orderId/:currentStatus', (req, res) => {
    const orderId = req.params.orderId;
    const currentStatus = req.params.currentStatus;

    orderRepo.update('shipped', orderId)
        .then(() => {
            res.json({ message: 'Order status updated successfully' });
        })
        .catch(error => {
            console.error('Error updating order status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
  

app.all('/receivingDesk', (req, res) => {
	inventoryRepo.getAll()
		.then((list) => {
			res.render('receivingDesk.ejs', { all: list })
		})
})

const credit = require('./controllers/credit');
app.get('/processCC', (req, res) => {
	credit.processSample((result) => {
		res.render('credit.ejs', { data: result });
	});
})


const cart = require('./controllers/cart');
app.get('/shoppingCart', function (req, res) {
	const currentCart = [
		{
			id: 1,
			name: 'windshield w/ polymer',
			price: 178.76, weight: 0.55,
			image: 'https://blitz.cs.niu.edu/pics/shi.jpg'
		},

		{
			id: 2,
			name: 'wiper blade pair',
			price: 23.37,
			weight: 2.5,
			image: 'https://blitz.cs.niu.edu/pics/wip.jpg'
		},

		{
			id: 8,
			name: 'supercharger',
			price: 711.14,
			weight: 99.99,
			image: 'https://blitz.cs.niu.edu/pics/anc.jpg'
		},
	];

	res.render('cart.ejs', { currentCart });
});




app.listen(port, () => {
	console.log(`Express server listening at http://localhost:${port}`)
})
