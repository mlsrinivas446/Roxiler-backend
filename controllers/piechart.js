const ProductTransaction = require('../models/productTransactionSchema');

const PieChart = async (req, res) => {
    try {
        const { month } = req.query;

        const monthNumber = parseInt(month, 10);

        // Validate monthNumber
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            return res.status(400).json({ message: 'Invalid month provided. Please provide a month between 1 and 12.', error: true });
        }

        const AggregateMonth = await ProductTransaction.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }
                }
            }
        ]);

        const categories = ['jewelery', "women's clothing", "men's clothing", 'electronics'];
        const categoryCount = categories.map(category => {
            const count = AggregateMonth.reduce((acc, curr) => curr.category === category ? acc + 1 : acc, 0);
            return { category, count };
        });

        return res.status(200).json({
            data: categoryCount,
            message: "Successfully retrieved pie chart data.",
            success: true
        });
    } catch (error) {
        console.error("Error retrieving pie chart data:", error);
        return res.status(500).json({
            message: error.message || error,
            success: false
        });
    }
};

module.exports = PieChart;
