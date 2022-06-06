const deleteCategoryHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const deleteCategory = async (req, res) => {        
        const { id } = req.params;
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                } 

                let sql_query = `DELETE FROM categories WHERE id = ${id};`;
                connection.query(`SELECT * FROM categories WHERE id = ${id}`, (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            sucess: false,
                            message: err.message,
                        });
                    }

                    if (results.length === 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'Category not found',
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
                            results
                        });
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

    return deleteCategory;
}

module.exports = deleteCategoryHandler;