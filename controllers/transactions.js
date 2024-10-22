const ProductTransaction = require('../models/productTransactionSchema');

// API to list all transactions 
const Transactions = async (req, res) => {
    try {
        const { month, search, page = 1, perPage = 10 } = req.query;
        const regex = search ? new RegExp(search, 'i') : null;

        const monthNumber = parseInt(month, 10);

        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            return res.status(400).json({ message: 'Invalid month provided.', error: true });
        }

        const query = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber]
            },
            $or: []
        };

        if (regex) {
            query.$or.push(
                { title: { $regex: regex } },
                { description: { $regex: regex } }
            );
        }

        const price = parseFloat(search);
        if (!isNaN(price)) {
            query.$or.push({ price });
        }

        const transactions = await ProductTransaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        
        const totalProducts = await ProductTransaction.countDocuments(query);

        return res.status(200).json({
            data: { transactions, totalProducts},
            message: 'Successfully retrieved transactions.',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false
        });
    }
};

module.exports = Transactions;
