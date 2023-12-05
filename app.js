const express = require('express')
const asyncHandler = require('express-async-handler')
const bodyParser = require('body-parser')
const AppDAO = require('./models/app_dao')
const LegacyDAO = require('./models/legacy_dao')
const PartRepository = require('./models/part_repository')
const OrderRepo = require('./models/order_repository')
const InventoryRepo = require('./models/inventory_repository')
const OrderItemsRepo = require('./models/order_items_repository')
const orderRouter = require('./models/order_repository')
const shopRouter = require('./routes/shop')
const shippingRouter = require('./routes/shipping_cost')
const warehouseRouter = require('./routes/warehouse')

const dao = new AppDAO('./db/database.db')
const legacyDao = new LegacyDAO()
const partRepo = new PartRepository(legacyDao)
const orderRepo = new OrderRepo(dao)
const orderItemsRepo = new OrderItemsRepo(dao)
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
const ordersController = require('./controllers/order_controller')

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

app.all('/viewPackingList/:orderId', asyncHandler(async (req, res, next) => {
    const orderId = req.params.orderId
    try {
        let items = await orderItemsRepo.getById(orderId)
        for (item of items) {
            item.description = ((await partRepo.getById(item.partNumber))[0].description)
        }
        res.render('viewPackingList', { all : items })
    } catch {
        console.error('Error viewing packing list:', error)
    }
}))

app.all('/viewInvoice/:orderId', asyncHandler(async (req, res, next) => {
    const orderId = req.params.orderId
    try {
        let items = await orderItemsRepo.getById(orderId)
        let order = await orderRepo.getById(orderId)
        for (item of items) {
            item.description = ((await partRepo.getById(item.partNumber))[0].description)
            item.price = ((await partRepo.getById(item.partNumber))[0].price)
        }
        res.render('viewInvoice', { all : items , order: order})
    } catch {
        console.error('Error viewing invoice:', error)
    }
}))

app.all('/viewShippingLabel/:orderId', asyncHandler(async (req, res, next) => {
    const orderId = req.params.orderId
    try {
        let items = await orderItemsRepo.getById(orderId)
        let order = await orderRepo.getById(orderId)
        for (item of items) {
            item.description = ((await partRepo.getById(item.partNumber))[0].description)
            item.price = ((await partRepo.getById(item.partNumber))[0].price)
        }
        res.render('viewShippingLabel', { all : items , order: order})
    } catch {
        console.error('Error viewing shipping label:', error)
    }
}))

app.all('/orders', (req, res) => {
    orderRepo.getAll()
    .then((list) => {
        res.render('orders.ejs', {
            all: list
        });
    })
    .catch((error) => {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    });
})

app.get('/adminHomepage', (req, res) => {
    res.render('adminHomepage');
})

app.all('/shippingBracket', (req, res) => {
	res.render('shippingBracket');
})

app.post('/updateQuantityOnHand', receivingController.updateQuantityOnHand)

app.post('/displaySearchResults', receivingController.displaySearchResults)

app.get('/receivingDesk', receivingController.index)

app.post('/displayOrderFilterDate', ordersController.displayOrderFilterDate)

app.post('/displayOrderFilterAmount', ordersController.displayOrderFilterAmount)

app.post('/displayOrderFilterStatus', ordersController.displayOrderFilterStatus)

app.listen(port, () => {
	console.log(`Express server listening at http://localhost:${port}`)
})
