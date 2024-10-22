const ProductTransaction = require('../models/productTransactionSchema');
const BarChart = async (req, res) => {
    try {
        const { month } = req.query;
        const monthNumber = parseInt(month, 10);

        // Validate monthNumber
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            return res.status(400).json({ message: 'Invalid month provided.', error: true });
        }

        // Price ranges
        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901+', min: 901, max: Infinity }
        ];

        // Calculate price range and the number of items
        const rangeCounts = await Promise.all(
            priceRanges.map(async (range) => {
            const itemsCount = await ProductTransaction.countDocuments({
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, monthNumber]
                },
                price: { $gte: range.min, $lt: range.max }
            });
            return { range: range.range, itemsCount };
            })
        );

        return res.status(200).json({data:rangeCounts,message:"Successfully retrieved bar chart data.",success: true});
    }
    catch (error) {
        return res.status(500).json({message:error.message || error,success: false});
    }
    
};

module.exports = BarChart