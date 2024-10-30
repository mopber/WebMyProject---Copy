const bcrypt = require('bcrypt')
const Sale = require('../models/Sale')

module.exports = (req, res) => {
    const { email, password } = req.body 

    Sale.findOne({ email: email }).then((sale) => {
        console.log(sale)

        if (sale) {
            let cmp = bcrypt.compare(password, sale.password).then((match) => {
                if (match) {
                    req.session.saleId = sale._id
                    res.redirect('/homesale')
                } else {
                    res.redirect('/loginsale')
                }
            })
        } else {
            res.redirect('/loginsale')
        }
    })
}