const deleteProductHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const deleteProduct = async (req, res) => {
        const { id } = req.params;
        
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                } 

                let sql_query = `DELETE FROM products WHERE id = ${id}`;
                connection.query(`SELECT * FROM products WHERE id = ${id};`, (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            sucess: false,
                            message: err.message,
                        });
                    }

                    if (results.length === 0) {
                        return res.status(404).json({
                            success: false,
                            message: 'Product not found',
                        });
                    }
                    connection.query(sql_query, (err, results) => {
                        connection.release();
                        if (err) {
                            return res.status(500).json({
                                sucess: false,
                                message: err.message,
                            });
                        }

                        return res.status(200).json({
                            success: true,
                            data: results,
                        });
                    })
                });
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };

    return deleteProduct;
}

module.exports = deleteProductHandler;