
const postNewCategoryHandler = (diHash) => {
    const {
        pool,
        bcrypt,
    } = diHash;
    
    const postNewCategory = async (req, res) => {
        const { 
            name, description = "No description.", image_url
        } = req.body;
        
        if (!name || !description) {
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
                CALL usp_NewCategory(
                    '${name}',
                    '${description}',
                    ${image_url ? `'${image_url}'` : null}
                );
            `;

            connection.query(`SELECT * FROM categories WHERE name = '${name}'`, (err, results) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                } 
                
                if (results.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Category name already exists',
                    });
                }

                connection.query(query, (err, results) => {
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

    return postNewCategory;
}

module.exports = postNewCategoryHandler;