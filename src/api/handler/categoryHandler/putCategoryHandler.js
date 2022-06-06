const putCategoryHandler = (diHash) => {
    const {
        pool,
    } = diHash;

    const putCategory = async (req, res) => {
        const { id } = req.params;
        const {
            name, description, image_url
        } = req.body;

        pool.getConnection((err, connection) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }

            connection.query(`SELECT * FROM categories WHERE id = ${id}`, (err, results) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Category not found',
                    })
                }

                let sql_query = `
                            UPDATE categories
                            SET name = '${name}', description = '${description}', image_url = ${image_url === null || image_url === '' ? null : `'${image_url}'`}
                            WHERE id = ${id};
                        `;
                        
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
                        results
                    });
                });
            });

        });
    };
    return putCategory;
}

module.exports = putCategoryHandler;