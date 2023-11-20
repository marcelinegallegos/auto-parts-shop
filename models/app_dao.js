const Promise = require('bluebird')
const sqlite3 = require('sqlite3').verbose()
var fs = require('fs')

class AppDAO {
    constructor(filename) {
        if (!fs.existsSync('./db')) {
            fs.mkdirSync('./db')
        }

        this.db = new sqlite3.Database(filename, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Connected to the database.')
            }
        })
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.error(err.message)
                    reject(err);
                } else {
                    resolve({ id: this.lastID })
                }
            })
        })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.error(err.message)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error(err.message)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = AppDAO