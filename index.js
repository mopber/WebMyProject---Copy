const express = require('express')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const expressSession = require('express-session')
const flash = require('connect-flash')

// MongoDB Connection
mongoose.connect('mongodb+srv://iloveproject:123456789azo@cluster0.jbtly7u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true
})



// Controllers
const indexController = require('./controllers/indexController')
const loginController = require('./controllers/loginController')
const registerController = require('./controllers/registerController')
const registersale = require('./controllers/registerSale')
const storeUserController = require('./controllers/storeUserController')
const loginUserController = require('./controllers/loginUserController')
const logoutController = require('./controllers/logoutController')
const homeController = require('./controllers/homeController')
const homeSale = require('./controllers/homeSale')
const storeSale = require('./controllers/storeSale')
const loginSale = require('./controllers/loginSale')
const loginSaleController = require('./controllers/loginSaleController')
const Survey = require('./controllers/Survey');
const Survey2 = require('./controllers/Surver2');
const adminpage = require('./controllers/adminController')
const deleteController = require('./controllers/deleteController');

// Middleware
const redirectIfAuth = require('./middleware/redirectIfAuth')
const redirectSale = require('./middleware/redirectSale')
const authMiddleware = require('./middleware/authMiddleware')
const authMiddlesale = require('./middleware/authMiddlesale')
const User = require('./models/User')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(expressSession({
    secret: "node secret"
}))

app.use("*", (req, res, next) => {
    global.loggedIn = null;
    global.isSales = false; 
    if (req.session.userId) {
        global.loggedIn = req.session.userId
    } else if(req.session.saleId) {
        global.loggedIn = req.session.saleId
        global.isSales = true;
    }
    console.log(loggedIn)
    next()
})

app.set('view engine', 'ejs')

app.get('/', indexController)
app.get('/home', homeController)
app.get('/homesale', authMiddlesale, homeSale)
app.get('/login', redirectIfAuth, loginController)
app.get('/loginsale', redirectSale, loginSale)
app.get('/register', redirectIfAuth, registerController)
app.get('/registersale', redirectSale, registersale)
app.post('/user/register', redirectIfAuth, storeUserController)
app.post('/user/login', redirectIfAuth, loginUserController)
app.get('/logout', logoutController)
app.post('/sale/registersale', redirectSale, storeSale)
app.post('/sale/loginsale', redirectSale, loginSaleController)
app.post('/submit-survey', Survey);
app.post('/submit-survey2', Survey2);
app.use('/admin', adminpage);
app.post('/delete', deleteController);
app.get('/predict2', async (req, res) => {
    try {
      // Fetch user data based on session ID
      const UserData = await User.findById(req.session.userId);
      res.render('predict2', {
        UserData,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).send('An error occurred while retrieving user data.');
    }
  })

app.listen(4000, () => {
    console.log("App listening on port 4000")
})