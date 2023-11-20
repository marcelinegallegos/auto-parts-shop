const express = require('express')
const shopRouter = require('./routes/shop')
const LegacyDAO = require('./models/legacy_dao')
const PartRepository = require('./models/part_repository')

const legacyDao = new LegacyDAO();
const partRepo = new PartRepository(legacyDao);


const app = express()
var port = process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static("public"))
app.use(express.static("./node_modules/bootstrap/dist/"))
app.use(express.static("./node_modules/bootstrap-icons/"))

app.use("/shop", shopRouter)

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

app.all('/workstation', (req, res) => {
  res.render('workstation.ejs');
})

app.all('/receivingDesk', (req, res) => {
  res.render('receivingDesk.ejs');
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
