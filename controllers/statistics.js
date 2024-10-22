const ProductTransaction = require('../models/productTransactionSchema');

const Statistics = async (req, res) => {
    try {
        const { month } = req.query;
        const monthNumber = parseInt(month, 10);

        // Validate monthNumber
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            return res.status(400).json({ message: 'Invalid month provided.', error: true });
        }

        // Calculate total sales
        const totalSale = await ProductTransaction.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
                            { $eq: ["$sold", true] } 
                        ]
                    }
                }
            },
            { $group: { _id: null, totalAmount: { $sum: '$price' } } }
        ]);
        //console.log(totalSale)

        // count of sold items
        const totalSoldItems = await ProductTransaction.countDocuments({
            $expr: {
                $and: [
                    { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
                    { $eq: ["$sold", true] } 
                ]
            }
        });

        // Count of unsold items
        const totalNotSoldItems = await ProductTransaction.countDocuments({
            $expr: {
                $and: [
                    { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
                    { $eq: ["$sold", false] }
                ]
            }
        });

        return res.status(200).json({
            data: {
                totalSale: totalSale[0]?.totalAmount || 0,
                totalSoldItems,
                totalNotSoldItems
            },
            message: "Statistics retrieved successfully",
            success: true
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message || error,
            success: false
        });
    }
};

module.exports = Statistics;
