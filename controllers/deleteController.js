const User = require('../models/User');
const Sale = require('../models/Sale');

module.exports = async (req, res) => {
    const { type, ids } = req.body;

    try {
        if (type === 'users') {
            await User.deleteMany({ _id: { $in: ids } });
        } else if (type === 'sales') {
            await Sale.deleteMany({ _id: { $in: ids } });
        }
        res.status(200).send('Deleted successfully.');
    } catch (error) {
        console.error('Error deleting items:', error);
        res.status(500).send('Error deleting items.');
    }
};
