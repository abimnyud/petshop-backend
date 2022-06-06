const getCategoryHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getCategory = async (req, res) => {       
        const { id } = req.params;
        
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                } 

                let sql_query = `SELECT * FROM categories WHERE id = ${id}`;
                
                connection.query(sql_query, (err, results) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            sucess: false,
                            message: err.message,
                        });
                    }

                    if (results.length === 0) {
                        return res.status(404).json({
                            success: false,
                            message: 'Category not found',
                        });
                    }
                    
                    return res.status(200).json({
                        success: true,
                        data: results[0]
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

    return getCategory;
}

module.exports = getCategoryHandler;