module.exports = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/')
    }
    console.log('welcome')
    next()
}