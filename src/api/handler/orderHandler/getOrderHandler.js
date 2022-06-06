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
                        SELECT  op_links.order_number, products.id, products.name, products.image_url,
                                products.price, op_links.quantity, (products.price * op_links.quantity) AS total
                        FROM orders_products_links op_links
                        LEFT JOIN products ON op_links.product_id = products.id
                        WHERE op_links.order_number = ${id};
                    `; 
                

                connection.query(sql_query, (err, results) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message,
                        });
                    }

                    if (results[0].length === 0) {
                        return res.status(404).json({
                            success: false,
                            message: `Order not found`,
                        });
                    }
                    
                    resultOne = results[0][0];
                    const data = {
                        order_number: resultOne.order_number,
                        member: {
                            member_id: resultOne.member_id,
                            name: resultOne.member_name,
                        },
                        total: resultOne.total,
                        status: resultOne.status,
                        description: resultOne.description,
                        admin: {
                            admin_id: resultOne.admin_id,
                            name: resultOne.admin_name,
                        },
                        products: results[1],
                        created_at: resultOne.created_at,
                        updated_at: resultOne.updated_at,
                    };

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