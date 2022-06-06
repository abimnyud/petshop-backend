const getOrderListHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getOrderList = async (req, res) => {
        const { 
            populate,
            direction = "asc",
            page = 1,
            length = 10
        } = req.query;
        
        const start = (page - 1) * (length);
        const sortBy = "orders.created_at";

        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message,
                    });
                } 
                
                let sql_query;
                const isPopulate = populate === '' || populate === 'true';

                if (isPopulate) {
                    sql_query = `
                        SELECT  orders.order_number, total, status, orders.description,
                                members.member_id, members.name AS member_name,
                                admins.admin_id, admins.name AS admin_name,
                                orders.created_at, orders.updated_at
                        FROM orders 
                        LEFT JOIN members ON orders.member_id = members.member_id
                        LEFT JOIN admins ON orders.admin_id = admins.admin_id
                        ORDER BY ${sortBy} ${direction}
                        LIMIT ${start}, ${length};
                        SELECT  orders_products_links.order_number, products.id, products.name, products.image_url,
                                products.price, orders_products_links.quantity
                        FROM orders_products_links
                        LEFT JOIN products ON orders_products_links.product_id = products.id;
                        SELECT COUNT(*) AS total FROM orders;
                    `; 
                } else {
                    sql_query = `
                        SELECT * FROM orders
                        ORDER BY ${sortBy} ${direction}
                        LIMIT ${start}, ${length};
                        SELECT COUNT(*) AS total FROM orders;
                    `;
                }
    
                connection.query(sql_query, (err, results) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message,
                        });
                    }
    
                    const data = [];
                    
                    if (isPopulate) {
                        results[0].forEach((item) => {
                                data.push({
                                    order_number: item.order_number,
                                    member: {
                                        member_id: item.member_id,
                                        name: item.member_name,
                                    },
                                    total: item.total,
                                    status: item.status,
                                    description: item.description,
                                    admin: {
                                        admin_id: item.admin_id,
                                        name: item.admin_name,
                                    },
                                    products: [],
                                    created_at: item.created_at,
                                    updated_at: item.updated_at,
                                })
                            });
                        
                        results[1].forEach((item) => {
                            data.forEach((order) => {
                                if (order.order_number === item.order_number) {
                                    order.products.push({
                                        product_id: item.id,
                                        name: item.name,
                                        image_url: item.image_url,
                                        price: item.price,
                                        quantity: item.quantity,
                                    })
                                }
                            })
                        });
                    } else {
                        results[0].forEach((item) => {
                            data.push({
                                order_number: item.order_number,
                                total: item.total,
                                status: item.status,
                                description: item.description,
                                created_at: item.created_at,
                                updated_at: item.updated_at,
                            })
                        })
                    }
    
                    return res.status(200).json({
                        success: true,
                        data,
                        meta: {
                            page: Number(page),
                            length: Number(length),
                            total: results[isPopulate ? 2 : 1][0].total
                        }
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

    return getOrderList;
}

module.exports = getOrderListHandler;