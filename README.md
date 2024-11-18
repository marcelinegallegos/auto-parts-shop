# Auto Parts Shop

This project was developed as part of **CSCI 467 Software Engineering** at Northern Illinois University. The application enables customers to browse an online catalog of auto parts, place orders, pay securely, and track shipping. It also includes administrative features and warehouse management tools to ensure smooth operations.

## Features

1. **Customer Ordering Interface**:
   - Browse catalog with product details (name, description, picture, price, and available quantity).
   - Place orders with a secure checkout process.
   - Receive email confirmation after successful order placement.

2. **Warehouse Interface**:
   - Print packing lists for orders.
   - Update inventory upon receipt of shipments.
   - Notify customers via email when orders are shipped.

3. **Administrator Interface**:
   - Configure shipping and handling charges based on weight brackets.
   - View and filter orders by date, status, or price range.

4. **Integration with External Systems**:
   - Connects to a legacy product database for product details.
   - Authorizes payments via a credit card processing system.

## System Architecture

The system was designed with modular interfaces for:

- Customer ordering
- Warehouse operations
- Administrative tools

### Use Case Summary

- **Order Products**: Customers browse, order, and pay for items online.
- **Pack and Ship Order**: Warehouse staff pack and update order status.
- **Update Inventory**: Receiving desk updates product inventory levels.
- **Set Shipping and Handling Charges**: Administrator configures shipping costs.
- **View Orders**: Administrator manages and filters orders.

## Technologies and Libraries

This project uses the following key libraries:

- **Frontend**:  
  - [Bootstrap](https://getbootstrap.com/) – Responsive design and UI components.  
  - [EJS](https://npmjs.com/package/ejs) – Templating engine for rendering views.  

- **Backend**:  
  - [Express.js](https://expressjs.com/) – Web framework for Node.js.  
  - [Express-session](https://www.npmjs.com/package/express-session) – Session management.  
  - [Body-parser](https://www.npmjs.com/package/body-parser) – Middleware for parsing request bodies.  

- **Database**:  
  - [MySQL](https://www.mysql.com/) – Relational database for product and order data.  
  - [SQLite3](https://www.sqlite.org/index.html) – Lightweight local database.

- **Email & Payment**:  
  - [Nodemailer](https://nodemailer.com/) – Email sending for order confirmation and shipping updates.  
  - [Axios](https://axios-http.com/) – HTTP client for external requests (e.g., payment integration).

- **Additional Libraries**:
  - [Popper.js](https://popper.js.org/) – Tooltips and popovers for Bootstrap.  
  - [Bootstrap Icons](https://icons.getbootstrap.com/) – Icons for UI.  
  - [Bluebird](https://www.npmjs.com/package/bluebird) – Promises library for async operations.  
  - [Nodemailer Express Handlebars](https://www.npmjs.com/package/nodemailer-express-handlebars) – Email templating.  
  - [Dotenv](https://www.npmjs.com/package/dotenv) – Environment variable management.
  
## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/marcelinegallegos/auto-parts-shop.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:
   - Use the provided schema to initialize the SQLite database.
   - Configure `.env` file with database and email credentials.
4. Start the application:

   ```bash
   npm start
   ```

## Credits

This project was developed by a collaborative team of five members:

- **[Huajie Huang](https://github.com/joejrobin)** and **[Joe Robin](https://github.com/HuajieHuang-z1975847)**:
  - Focused on the "Set Shipping and Handling Charges" and "View Orders" administrative features.

- **[Kendra Ferguson](https://github.com/kkendra15)**:
  - Frontend development, focusing on the overall layout and design.
  - Created the navigation bar, shopping cart, ordering interface, and order confirmation.

- **[Marceline Gallegos](https://github.com/marcelinegallegos)**:
  - Backend development, including all databases, controllers, models, routers, and DAO.
  - Developed the catalog frontend.
  - Assisted with the shopping cart and ordering interface.
  - Implemented the credit card integration and the mail service.

- **[Megan Moisant](https://github.com/meganmoisant)**:
  - Developed the warehouse interface, including inventory management and pack-and-ship functionality.
  - Created custom shipping labels for all orders.

Although each member had specific responsibilities, we frequently supported each other and collaborated to ensure project success.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
