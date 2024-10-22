1.Database Setup
    * Used a MongoDB for storing transaction data.
    * Schema Structure (if using MongoDB)
        {
        "productId": String,
        "title": String,
        "description": String,
        "price": Number,
        "category": String,
        "sold": Boolean, 
        "dateOfSale": Date
        }

2.Initialize Database with Seed Data:

    *Fetch data from a third-party API and seed your database. This API should be created to initialize the database.
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

3. List Transactions API with Search and Pagination:

    *Create an API that lists all transactions with pagination, allowing search functionality based on title, description, or price.

    *Example endpoint: /api/transactions?month=March&page=1&per_page=10&search=text

4. Statistics API:

    * Create an API that provides:
        Total sale amount for the selected month.
        Total number of sold items for the selected month.
        Total number of not-sold items for the selected month.
        Example endpoint: /api/statistics?month=3 // 3 means March

5. Bar Chart API:

    *Create an API that returns price ranges and the number of items in each range for the selected month.
    Example endpoint: /api/bar-chart?month=3 // 3 means March

6.Combined API:

    * This API fetches data from all three APIs (statistics, bar chart, pie chart) and combines them.

    Example endpoint: /api/combined-data?month=March