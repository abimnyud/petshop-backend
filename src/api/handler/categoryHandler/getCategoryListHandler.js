const getCategoryHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getCategory = async (req, res) => { 
        const { 
            direction = "asc",
            page = 1,
            length = 10
        } = req.query;
        
        const start = (page - 1) * (length);
        const sortBy = "categories.created_at";
        
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                } 

                let sql_query = `
                    SELECT * FROM categories
                    ORDER BY ${sortBy} ${direction}
                    LIMIT ${Number(start)}, ${Number(length)};
                    SELECT COUNT(*) AS total FROM categories;
                `;
                
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
                        data: results[0],
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

    return getCategory;
}

module.exports = getCategoryHandler;