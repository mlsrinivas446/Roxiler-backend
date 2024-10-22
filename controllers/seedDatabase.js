const axios = require("axios")
const ProductTransaction = require("../models/productTransactionSchema")

// API to initialize the database
const seedDatabase =async (req, res) => {

    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;
        const formatData = data.map(each => ({
            productId: each.id,
            title: each.title,
            description: each.description,
            category: each.category,
            image: each.image,
            price: each.price,
            sold: each.sold,
            dateOfSale: new Date(each.dateOfSale)
        }))
        
        await ProductTransaction.deleteMany({});
        await ProductTransaction.insertMany(formatData);

        return res.status(200).json({
            message: 'Database seeded successfully.',
            success: true
        })

    }
    catch(error) {
        return res.status(500).json({
            message: error.message || error,
            success: false
        })
    }
    
}

module.exports = seedDatabase