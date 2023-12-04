const axios = require('axios');

async function processCredit(cc, name, exp, amount) {
    const response = await axios.post('http://blitz.cs.niu.edu/creditcard', {
        'vendor': 'VE001-99',
        'trans': '907-987654321-296',
        'cc': cc,
        'name': name,
        'exp': exp,
        'amount': amount
    })

    return response.data
}

module.exports = processCredit