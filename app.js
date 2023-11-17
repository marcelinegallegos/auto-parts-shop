const express = require('express')
const LegacyDAO = require('./models/legacy_dao');
const ProductRepository = require('./models/product_repository');

const legacyDao = new LegacyDAO();
const productRepo = new ProductRepository(legacyDao);


const app = express()
var port = process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/', (req, res) => {
	res.render('index');
})

app.get('/getParts', (req, res) => {
	productRepo.getAll()
		.then((list) => {
			res.render('parts.ejs', { all: list })
		})
})

app.get('/api/parts', (req, res) => {
	productRepo.getAll()
		.then((list) => {
			res.json({ all: list })
		})
})

app.get('/warehouseHomepage', (req, res) => {
	res.render('warehouseHomepage.ejs');
})

app.post('/workstation', (req, res) => {
	res.render('workstation.ejs');
})

app.post('/receivingDesk', (req, res) => {
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
