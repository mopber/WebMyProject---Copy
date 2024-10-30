module.exports = (req, res, next) => {
    if (req.session.saleId) {
        return res.redirect('/homesale')
    }
    console.log('welcome sale')
    next()
}