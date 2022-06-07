const loginHandler = (diHash) => {
    const {
        pool,
        bcrypt,
        jwt
    } = diHash;
    
    const login = async (req, res) => {
        const { 
            username, password
        } = req.body;
        
        if (!username || !password) {
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

            const sql_query = `SELECT * FROM admins WHERE username = '${username}'`;

            connection.query(sql_query, (err, results) => {
                connection.release();
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                } 
                
                if (results.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid username or password',
                    });
                }

                bcrypt.compare(password, results[0].password, function(err, result) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message,
                        });
                    }
                    
                    if (!result) {
                        return res.status(400).json({
                            success: false,
                            message: 'Invalid username or password',
                        });
                    }

                    const token = jwt.sign({
                        admin_id: results[0].admin_id,
                        username: results[0].username,
                        name: results[0].name,
                    }, process.env.JWT_SECRET)

                    return res.status(200)
                        .cookie('token', token, {
                            expires: new Date(Date.now() + 8 * 3600000)
                        })
                        .json({
                            success: true,
                            accessToken: token
                        });
                })
            });
        });
    };

    return login;
}

module.exports = loginHandler;