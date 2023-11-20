class PartRepository {
    constructor(dao) {
        this.dao = dao
    }

    getById(number) {
        return this.dao.query(
            `SELECT * FROM parts WHERE number = ?`,
            [number]
        )
    }
    
    getAll() {
        return this.dao.query(`SELECT * FROM parts`)
    }
}

module.exports = PartRepository