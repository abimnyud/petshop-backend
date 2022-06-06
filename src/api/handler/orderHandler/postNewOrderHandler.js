const postNewOrderHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const postNewOrder = async (req, res) => {
        const { 
            carts,
            member_id,
            admin_id 
        } = req.body;
        
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message,
                    });
                }

                
                let sql_query = `
                CALL usp_NewOrder(
                    '${JSON.stringify(carts)}',
                    ${member_id},
                    ${admin_id}
                    );
                `; 

                connection.query(sql_query, (err, results, fields) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message,
                        });
                    }
    
                    return res.status(200).json({
                        success: true,
                        results,
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

    return postNewOrder;
}

module.exports = postNewOrderHandler;