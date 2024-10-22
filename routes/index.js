const express = require("express")
const seedDatabase = require("../controllers/seedDatabase")
const Transactions = require("../controllers/transactions")
const Statistics = require("../controllers/statistics")
const BarChart = require("../controllers/barchart")
const PieChart = require("../controllers/piechart")
const Combined = require("../controllers/combined")

const router = express.Router()

router.get("/seed-database", seedDatabase) // API to seed the database
router.get("/transactions", Transactions) //API to list the all transactions 
router.get("/statistics", Statistics) //API for statistics 
router.get("/bar-chart", BarChart)// API for bar chart 
router.get("/pie-chart", PieChart)// API for pie chart 
router.get("/combined-data", Combined)

module.exports = router