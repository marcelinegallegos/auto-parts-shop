const axios = require('axios')

function generateUniqueId() {
    const timestamp = new Date().getTime()
    const random = Math.floor(Math.random() * 1000)
    return `${timestamp}-${random}`
}

async function processCredit(cc, name, exp, amount) {
    const trans = generateUniqueId()
    const response = await axios.post('http://blitz.cs.niu.edu/creditcard', {
        'vendor': 'FA2023-1A',
        'trans': trans,
        'cc': cc,
        'name': name,
        'exp': exp,
        'amount': amount
    })

    return response.data
}

module.exports = processCredit