const asyncHandler = require('express-async-handler')

exports.checkout = asyncHandler(async (req, res, next) => {
    res.render('checkout.ejs')
})