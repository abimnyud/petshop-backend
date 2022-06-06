
const getProductHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getProduct = async (req, res) => {
        const { id } = req.params;
        const { populate } = req.query;
        const isPopulate = populate === '' || populate === true;
        
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
                        WHERE products.id = ${id}
                    `
                } else {
                    sql_query = `
                        SELECT * FROM products
                        WHERE id = ${id}
                    `
                }
                
                connection.query(sql_query, (err, results, fields) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            sucess: false,
                            message: err.message,
                        });
                    }

                    if (isPopulate) {
                        results[0] = {
                            id: results[0].id,
                            image_url: results[0].image_url,
                            name: results[0].name,
                            description: results[0].description,
                            price: results[0].price,
                            weight: results[0].weight,
                            stock: results[0].stock,
                            sold: results[0].sold,
                            categories: {
                                id: results[0].categories_id,
                                name: results[0].categories_name,
                                total: results[0].categories_total,
                                description: results[0].categories_description,
                                image_url: results[0].categories_image_url,
                            },
                            created_at: results[0].created_at,
                            updated_at: results[0].updated_at,
                        };
                    }
                    
                    return res.status(200).json({
                        success: true,
                        data: results[0],
                    });
                });
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };

    return getProduct;
}

module.exports = getProductHandler;