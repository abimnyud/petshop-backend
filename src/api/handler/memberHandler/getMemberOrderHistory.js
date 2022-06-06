const getMemberOrderHistoryListHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getMemberOrderHistoryList = async (req, res) => {
        const { id } = req.params;

        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message,
                    });
                } 
                
                let sql_query = `
                    SELECT * FROM orders
                    WHERE member_id = ${id}
                `

                connection.query(sql_query, (err, results) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message,
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        data: results,
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

    return getMemberOrderHistoryList;
}

module.exports = getMemberOrderHistoryListHandler;