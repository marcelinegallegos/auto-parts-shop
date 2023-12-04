const express = require('express')
const bodyParser = require('body-parser')
const AppDAO = require('./models/app_dao')
const LegacyDAO = require('./models/legacy_dao')
const PartRepository = require('./models/part_repository')
const OrderRepo = require('./models/order_repository')
const InventoryRepo = require('./models/inventory_repository')
const shopRouter = require('./routes/shop')
const shippingRouter = require('./routes/shipping_cost')
const warehouseRouter = require('./routes/warehouse')

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
const checkoutController = require('./controllers/checkout_controller')

app.use('/shop', shopRouter)
app.use('/shipping_cost', shippingRouter)
app.use('/warehouse', warehouseRouter)


app.get('/', (req, res) => {
	res.render('index');
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

app.all('/viewPackingList/:orderId', (req, res) => {
    const orderId = req.params.orderId
    orderRepo.getById(orderId)
    .then((orderDetails) => {
        res.render('viewPackingList', { orderDetails })
    })
    .catch(error => {
        console.error('Error viewing packing list:', error)
        res.status(500).json({error: 'Internal Server Error'})
    })
})

app.all('/shippingBracket', (req, res) => {
	res.render('shippingBracket');
})

const credit = require('./controllers/credit');
app.get('/processCC', (req, res) => {
	credit.processSample((result) => {
		res.render('credit.ejs', { data: result });
	});
})

app.post('/updateQuantityOnHand', receivingController.updateQuantityOnHand)

app.post('/displaySearchResults', receivingController.displaySearchResults)

app.get('/receivingDesk', receivingController.index)

app.post('/getCustomerInfo', checkoutController.getCustomerInfo)

app.listen(port, () => {
	console.log(`Express server listening at http://localhost:${port}`)
})
