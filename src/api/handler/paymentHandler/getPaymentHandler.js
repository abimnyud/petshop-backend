const getPaymentHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getPayment = async (req, res) => {
        const { id } = req.params;
        
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message,
                    });
                } 
                
                let sql_query = `
                    SELECT  p.id, p.order_number, m.name AS member_name, p.use_points, p.amount,
                            p.discount, p.total, p.paid_amount, p.change, p.method,
                            a.name AS admin_name,
                            p.created_at
                    FROM payments p
                    LEFT JOIN members m ON p.member_id = m.member_id
                    LEFT JOIN admins a ON p.admin_id = a.admin_id
                    WHERE p.id = ${id};
                    SELECT  op_links.order_number, products.id, products.name, products.image_url,
                            products.price, op_links.quantity, (products.price * op_links.quantity) AS total
                    FROM orders_products_links op_links
                    LEFT JOIN products ON op_links.product_id = products.id
                    WHERE op_links.order_number = (SELECT order_number FROM payments WHERE id = ${id});
                `

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
                            message: 'Payment not found',
                        });
                    }

                    resultsOne = results[0][0];
                    const data = {
                        id: resultsOne.id,
                        order_number: resultsOne.order_number,
                        member_name: resultsOne.member_name,
                        products: results[1],
                        amount: resultsOne.amount,
                        use_points: resultsOne.use_points,
                        discount: resultsOne.discount,
                        total: resultsOne.total,
                        paid_amount: resultsOne.paid_amount,
                        change: resultsOne.change,
                        method: resultsOne.method,
                        admin_name: resultsOne.admin_name,
                        created_at: resultsOne.created_at
                    };

                    return res.status(200).json({
                        success: true,
                        data: data
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

    return getPayment;
}

module.exports = getPaymentHandler;