const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const Sale = require('../models/Sale');

router.get('/', async (req, res) => {
    const { type = 'users', query = '' } = req.query; 
    let data;

    try {
        if (type === 'users') {
            data = await User.find({ email: new RegExp(query, 'i') }); 
        } else if (type === 'sales') {
            data = await Sale.find({ email: new RegExp(query, 'i') }); 
        } else {
            return res.status(400).send('Invalid type.');
        }

        res.render('admin', { data, type , query}); 
    } catch (error) {
        console.error('Error loading admin page:', error);
        res.status(500).send('Error loading admin page.');
    }
});

router.get('/edit/:type/:email', async (req, res) => {
    console.log('Edit route hit');
    const { type, email } = req.params;
    let data;
    
    try {
        if (type === 'users') {
            data = await User.findOne({ email });
        } else if (type === 'sales') {
            data = await Sale.findOne({ email });
        } else {
            return res.status(400).send('Invalid type.');
        }

        if (!data) {
            return res.status(404).send('Data not found.');
        }
        res.render('edit', { type, data });
    } catch (error) {
        console.error('Error loading edit page:', error);
        res.status(500).send('Error loading edit page.');
    }
});

router.post('/update/:type/:email', async (req, res) => {
    const { type, email } = req.params;
    const { email: newEmail, password } = req.body;

    try {
        const updateData = { email: newEmail };

        // If password is provided, hash it before saving
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        if (type === 'users') {
            await User.findOneAndUpdate({ email }, updateData);
        } else if (type === 'sales') {
            await Sale.findOneAndUpdate({ email }, updateData);
        } else {
            return res.status(400).send('Invalid type.');
        }

        res.redirect(`/admin?type=${type}`);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data.');
    }
});


module.exports = router;
