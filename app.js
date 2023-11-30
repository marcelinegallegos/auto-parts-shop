const express = require('express')
const bodyParser = require('body-parser')
const AppDAO = require('./models/app_dao')
const LegacyDAO = require('./models/legacy_dao')
const PartRepository = require('./models/part_repository')
const OrderRepo = require('./models/order_repository')
const InventoryRepo = require('./models/inventory_repository')
const shopRouter = require('./routes/shop')
const shippingRouter = require('./routes/shipping_cost')

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
app.use(express.static('./node_modules/@popperjs/core/dist'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const receivingController = require('./controllers/receiving_desk_controller')
const receivingDeskRouter = require('./routes/receivingDesk')
const catalogController = require('./controllers/catalog_controller')
const cartController = require('./controllers/cart_controller')
const checkoutController = require('./controllers/checkout_controller')

app.use('/shop', shopRouter)
app.use('/shipping_cost', shippingRouter)


app.get('/', (req, res) => {
	res.render('index');
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

app.all('/shippingBracket', (req, res) => {
	res.render('shippingBracket');
})

const credit = require('./controllers/credit');
app.get('/processCC', (req, res) => {
	credit.processSample((result) => {
		res.render('credit.ejs', { data: result });
	});
})

app.post('/addToCart', cartController.addToCart)

app.get('/shoppingCart', cartController.getCart)

app.post('/removeItem', cartController.removeFromCart)

app.post('/updateQuantity', cartController.updateQuantity)

app.post('/checkout', checkoutController.checkout)

app.post('/updateQuantityOnHand', receivingController.updateQuantityOnHand)

app.get('/receivingDesk', receivingController.index)

app.listen(port, () => {
	console.log(`Express server listening at http://localhost:${port}`)
})
