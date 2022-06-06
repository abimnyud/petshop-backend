const getPaymentListHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getPaymentList = async (req, res) => {
        const { id } = req.params;
        const { 
            direction = "asc",
            page = 1,
            length = 10
        } = req.query;
        
        const start = (page - 1) * (length);
        const sortBy = "created_at";
        
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message,
                    });
                } 
                
                let sql_query = `
                    SELECT  p.id, p.order_number, m.member_id, m.name AS member_name, p.use_points, p.amount,
                            p.discount, p.total, p.paid_amount, p.change, p.method,
                            a.admin_id, a.name AS admin_name, p.created_at
                    FROM payments p
                    LEFT JOIN members m ON p.member_id = m.member_id
                    LEFT JOIN admins a ON p.admin_id = a.admin_id
                    ORDER BY ${sortBy} ${direction}
                    LIMIT ${start}, ${length};
                    SELECT COUNT(*) AS total FROM payments;
                `

                connection.query(sql_query, (err, results) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message,
                        });
                    }

                    const data = [];
                    results[0].forEach(result => {
                        data.push({
                            id: result.id,
                            order_number: result.order_number,
                            member_name: {
                                member_id: result.member_id,
                                name: result.member_name,
                            },
                            use_points: result.use_points,
                            amount: result.amount,
                            discount: result.discount,
                            total: result.total,
                            paid_amount: result.paid_amount,
                            change: result.change,
                            method: result.method,
                            admin: {
                                admin_id: result.admin_id,
                                admin_name: result.admin_name,
                            },
                            created_at: result.created_at,
                        });
                    });

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
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };

    return getPaymentList;
}

module.exports = getPaymentListHandler;