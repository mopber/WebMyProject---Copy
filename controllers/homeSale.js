const Sale = require('../models/Sale')

module.exports = async (req, res) => {
    let SaleData = await Sale.findById(req.session.saleId)
    res.render('homesale', {
        SaleData
    })
}