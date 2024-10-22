const ProductTransaction = require('../models/productTransactionSchema');

// Function to fetch statistics data
async function fetchStatistics(monthNumber) {
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

    // Count of sold items
    const soldItems = await ProductTransaction.countDocuments({
        $expr: {
            $and: [
                { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
                { $eq: ["$sold", true] }
            ]
        }
    });

    // Count of unsold items
    const unsoldItems = await ProductTransaction.countDocuments({
        $expr: {
            $and: [
                { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
                { $eq: ["$sold", false] }
            ]
        }
    });

    return { totalSale: Math.round(totalSale[0]?.totalAmount,1) || 0, soldItems, unsoldItems };
}

// Function to fetch bar chart data
async function fetchBarChartData(monthNumber) {
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

    return rangeCounts;
}

// Function to fetch pie chart data
async function fetchPieChartData(monthNumber) {
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

    return categoryCount;
}

// Combined function to gather all the data
const Combined = async (req, res) => {
    try {
        const { month } = req.query;
        const monthNumber = parseInt(month, 10);

        // Validate monthNumber
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            return res.status(400).json({ message: 'Invalid month provided. Please provide a month between 1 and 12.', error: true });
        }

        // Fetch all the required data
        const statistics = await fetchStatistics(monthNumber);
        const barChart = await fetchBarChartData(monthNumber);
        const pieChart = await fetchPieChartData(monthNumber);

        // Send combined data in the response
        res.json({
            statistics,
            barChart,
            pieChart,
            message: "Successfully retrieved all combined data",
            success: true
        });
        } catch (error) {
            console.error("Error retrieving combined data:", error);
            res.status(500).json({
                message: error ||"Error fetching combined data",
                success: false
            });
        }
};

module.exports = Combined;
