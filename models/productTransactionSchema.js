const mongoose =  require("mongoose")

const ProductTransactionSchema= new mongoose.Schema({
    productId: String,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
})

const ProductTransaction = mongoose.model("ProductTransaction", ProductTransactionSchema)

module.exports = ProductTransaction