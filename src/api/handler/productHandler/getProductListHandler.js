
const getProductListHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getProductList = async (req, res) => {
        const { 
            populate,
            direction = "asc",
            page = 1,
            length = 10
        } = req.query;
        
        const start = (page - 1) * (length);
        const sortBy = "products.created_at";
        const isPopulate = populate === '' || populate === 'true';

        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                }

                let sql_query;
                if (isPopulate) {
                    sql_query = `
                        SELECT  products.id, products.image_url, products.name, products.description,
                                products.price, products.weight, products.stock, products.sold,
                                products.created_at, products.updated_at, categories.id AS categories_id, 
                                categories.name AS categories_name, categories.total AS categories_total, 
                                categories.description AS categories_description, 
                                categories.image_url AS categories_image_url
                        FROM products
                        LEFT JOIN categories
                        ON products.category_id = categories.id
                        ORDER BY ${sortBy} ${direction}
                        LIMIT ${Number(start)}, ${Number(length)};
                        SELECT COUNT(*) AS total FROM products
                    `
                } else {
                    sql_query = `
                        SELECT * FROM products
                        ORDER BY ${sortBy} ${direction}
                        LIMIT ${Number(start)}, ${Number(length)};
                        SELECT COUNT(*) AS total FROM products
                    `
                }

                
                connection.query(sql_query,  (err, results) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message,
                        });
                    } 
                    
                    const data = [];
                    
                    if (isPopulate) {
                        results[0].forEach(item => {
                            data.push({
                                id: item.id,
                                image_url: item.image_url,
                                name: item.name,
                                description: item.description,
                                price: item.price,
                                weight: item.weight,
                                stock: item.stock,
                                sold: item.sold,
                                categories: {
                                    id: item.categories_id,
                                    name: item.categories_name,
                                    total: item.categories_total,
                                    description: item.categories_description,
                                    image_url: item.categories_image_url,
                                },
                                created_at: item.created_at,
                                updated_at: item.updated_at,
                            });
                        })
                    } else {
                        results[0].forEach(item => {
                            data.push({
                                id: item.id,
                                image_url: item.image_url,
                                name: item.name,
                                description: item.description,
                                price: item.price,
                                weight: item.weight,
                                stock: item.stock,
                                sold: item.sold,
                                created_at: item.created_at,
                                updated_at: item.updated_at,
                            });
                        })
                    }

                    return res.status(200).json({
                        success: true,
                        data: data,
                        meta: {
                            page: Number(page),
                            length: Number(length),
                            total: results[1][0].total,
                        }
                    });
                });
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            })
        }
    };

    return getProductList;
}

module.exports = getProductListHandler;