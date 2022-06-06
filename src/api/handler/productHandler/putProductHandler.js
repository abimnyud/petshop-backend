
const postUpdateProductController = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const postUpdateProduct = async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Bad request'
            })
        }

        const { 
            name, description = null, 
            price, stock, weight, category_id, 
            sold = 0, image_url = null
        } = req.body;

        if (!name || !price || !stock || !weight || !category_id) {
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
                UPDATE products
                SET name = '${name}', description = '${description}',
                    price = ${price}, stock = ${stock}, weight = ${weight},
                    category_id = ${category_id}, sold = ${sold},
                    image_url = '${image_url}'
                WHERE id = ${id}
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

    return postUpdateProduct;
}

module.exports = postUpdateProductController;