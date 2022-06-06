const putAdminHandler = (diHash) => {
    const {
        pool,
        bcrypt,
    } = diHash;

    const putAdmin = async (req, res) => {
        const { id } = req.params;
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

            connection.query(`SELECT * FROM admins WHERE admin_id = ${id}`, (err, results) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Admin not found',
                    })
                }

                const saltRounds = 10;
                let sql_query = ``;
                if (password) {
                    bcrypt.hash(password, saltRounds, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message,
                            });
                        }
                            
                            sql_query = `
                                UPDATE admins
                                SET name = '${name}', username = '${username}', password = '${hash}'
                                WHERE admin_id = ${id};
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
                } else {
                    sql_query = `
                        UPDATE admins
                        SET name = '${name}', username = '${username}'
                        WHERE admin_id = ${id};
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
                }
            });
        });
    };
    return putAdmin;
}

module.exports = putAdminHandler;