
const postNewPaymentHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const postNewPayment = async (req, res) => {
        const { 
            order_number, use_points, paid_amount, method, admin_id
        } = req.body;

        if (!order_number || use_points === null || !paid_amount || !method || !admin_id) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request',
            });
        }

        pool.getConnection((err, connection) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }

            const query = `
                CALL usp_PayOrder(
                    ${order_number},
                    ${use_points},
                    ${paid_amount},
                    '${method}',
                    ${admin_id}
                )
            `;

            connection.query(query, (err, results) => {
                connection.release();
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                } 
                
                res.status(200).json({
                    success: true,
                    results
                });
            });
        })
    };

    return postNewPayment;
}

module.exports = postNewPaymentHandler;