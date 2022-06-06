
const postNewProductHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const postNewProduct = async (req, res) => {
        const { 
            name, description = "No description", 
            price, stock, weight, category_id, 
            sold = 0, image_url = null
        } = req.body;

        if (!name || !description || !price || !stock || !weight || !category_id) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request',
            });
        }

        // console.log(cart)
        pool.getConnection((err, connection) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }

            const query = `
                CALL usp_NewProduct(
                    '${name}',
                    '${description}',
                    ${Number(price)},
                    ${Number(stock)},
                    ${Number(weight)},
                    ${Number(category_id)},
                    ${Number(sold)},
                    '${image_url}'
                )
            `;

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
        })
    };

    return postNewProduct;
}

module.exports = postNewProductHandler;