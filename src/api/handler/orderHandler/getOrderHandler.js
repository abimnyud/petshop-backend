const getOrderHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getOrder = async (req, res) => {
        const { id } = req.params;
        
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message,
                    });
                }
                
                let sql_query = `
                        SELECT  orders.order_number, total, status, orders.description,
                                members.member_id, members.name AS member_name,
                                admins.admin_id, admins.name AS admin_name,
                                orders.created_at, orders.updated_at
                        FROM orders 
                        LEFT JOIN members ON orders.member_id = members.member_id
                        LEFT JOIN admins ON orders.admin_id = admins.admin_id
                        WHERE orders.order_number = ${id};
                        SELECT  orders_products_links.order_number, products.id, products.name, products.image_url,
                                products.price, orders_products_links.quantity
                        FROM orders_products_links
                        LEFT JOIN products ON orders_products_links.product_id = products.id
                        WHERE orders_products_links.order_number = ${id};
                    `; 
                

                connection.query(sql_query, (err, results, fields) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message,
                        });
                    }

                    if (results.length === 0) {
                        return res.status(404).json({
                            success: false,
                            message: `Order with id ${id} not found`,
                        });
                    }
                    
                    const resultOne = JSON.parse(JSON.stringify(results[0]));

                    const data = {
                        order_number: resultOne[0].order_number,
                        member: {
                            member_id: resultOne[0].member_id,
                            name: resultOne[0].member_name,
                        },
                        total: resultOne[0].total,
                        status: resultOne[0].status,
                        description: resultOne[0].description,
                        admin: {
                            admin_id: resultOne[0].admin_id,
                            name: resultOne[0].admin_name,
                        },
                        products: [],
                        created_at: resultOne[0].created_at,
                        updated_at: resultOne[0].updated_at,
                    };
                    
                    results[1].forEach((item) => {
                        data.products.push({
                            product_id: item.id,
                            name: item.name,
                            image_url: item.image_url,
                            price: item.price,
                            quantity: item.quantity,
                        })
                    });

                    return res.status(200).json({
                        success: true,
                        data,
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

    return getOrder;
}

module.exports = getOrderHandler;