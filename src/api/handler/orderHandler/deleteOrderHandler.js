const deleteOrderHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const deleteOrder = async (req, res) => {
        const { id } = req.params;
        
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message,
                    });
                }

                
                let sql_query = `CALL usp_CancelOrder(${id})`; 

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

    return deleteOrder;
}

module.exports = deleteOrderHandler;