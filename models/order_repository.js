class OrderRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT NOT NULL,
            date TEXT DEFAULT CURRENT_TIMESTAMP,
            amount REAL NOT NULL,
            weight REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            zip TEXT NOT NULL,
            country TEXT NOT NULL            
            CHECK(status IN ('pending', 'authorized', 'shipped', 'cancelled'))
        )`
        return this.dao.run(sql)
    }

    create(firstName, lastName, email, amount, weight, address, city, state, zip, country) {
        return this.dao.run(
            `INSERT INTO orders (firstName, lastName, email, amount, weight, address, city, state, zip, country)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, amount, weight, address, city, state, zip, country]
        )
    }
    
    

    update(status, id) {
        return this.dao.run(
            `UPDATE orders SET status = ? WHERE id = ?`,
            [status, id]
        )
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM orders WHERE id = ?`,
            [id]
        )
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM orders WHERE id = ?`,
            [id]
        )
    }

    getByDate(orderDate) {
        return this.dao.all(
            `SELECT * FROM orders WHERE date BETWEEN datetime('now', '-' || ? || ' days') AND datetime()`,
            [orderDate]
        );
    }

    getByStatus(status) {
        return this.dao.get(
            `SELECT * FROM orders WHERE status ?`,
            [status]
        )
    }

    getAll() {
        return this.dao.all(`SELECT * FROM orders`)
    }
}

module.exports = OrderRepository