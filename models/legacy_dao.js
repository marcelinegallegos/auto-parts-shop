const Promise = require('bluebird')
const dotenv = require('dotenv').config()
var mysql = require('mysql')

class LegacyDAO {
    constructor() {
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        })

        this.connection.connect((err) => {
            if (err) {
                console.error(err.message)
            } else {
                console.log('Connected to the legacy database.')
            }
        })
    }

    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (err, result) => {
                if (err) {
                    console.error(err.message)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
}

module.exports = LegacyDAO