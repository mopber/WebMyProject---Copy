const Sale = require('../models/Sale')

module.exports = (req, res) => {
    Sale.create(req.body).then(() => {
        console.log("User registered successfully!")
        res.redirect('/admin')
    }).catch((error) => {
        // console.log(error.errors)

        if (error) {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            req.flash('validationErrors', validationErrors)
            req.flash('data', req.body)
            return res.redirect('/registersale')
        }
    })
}