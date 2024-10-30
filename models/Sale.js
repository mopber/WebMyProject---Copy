const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const SaleSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide email']
    },
    password: {
        type: String,
        required: [true, 'Please provide password']
    }
})

SaleSchema.pre('save', function(next) {
    const sale = this

    bcrypt.hash(sale.password, 10).then(hash => {
        sale.password = hash
        next()
    }).catch(error => {
        console.error(error)
    })
})

const Sale = mongoose.model('Sale', SaleSchema)
module.exports = Sale