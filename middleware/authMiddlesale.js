const Sale = require('../models/Sale')

module.exports = (req, res, next) => {
    Sale.findById(req.session.saleId).then((sale) => {
        if (!sale) {
            return res.redirect('/homesale')
        }
        next()
    }).catch(error => {
        console.error(error)
    })
}