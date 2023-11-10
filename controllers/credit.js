const axios = require('axios');

module.exports = {
    processSample: async result => {
        var data = {
            'vendor': 'VE001-99',
            'trans': '907-987654321-296',
            'cc': '6011 1234 4321 1234',
            'name': 'John Doe', 
            'exp': '12/2020', 
            'amount': '654.32'
        };
        axios.post('http://blitz.cs.niu.edu/creditcard', data).then((response) => {           
            result(response.data);
        }).catch(err => {
            throw err;
        });
    }
}