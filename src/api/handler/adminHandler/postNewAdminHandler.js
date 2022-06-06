const postNewProductHandler = (diHash) => {
    const {
        pool,
        bcrypt,
    } = diHash;
    
    const postNewProduct = async (req, res) => {
        const { 
            name, username, password
        } = req.body;
        
        if (!name || !username || !password) {
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

            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                }

                const query = `
                    CALL usp_NewAdmin(
                        '${name}',
                        '${username}',
                        '${hash}'
                    );
                `;

                connection.query(`SELECT * FROM admins WHERE username = '${username}'`, (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message,
                        });
                    } 
                    
                    if (results.length > 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'Username already exists',
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
        });
    };

    return postNewProduct;
}

module.exports = postNewProductHandler;