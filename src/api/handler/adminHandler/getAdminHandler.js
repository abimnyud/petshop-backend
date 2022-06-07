const getAdminHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getAdmin = async (req, res) => {        
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                } 

                let sql_query = `
                    SELECT admin_id, name, username, status, created_at, updated_at 
                    FROM admins WHERE admin_id = ${req.params.id}
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
                        data: results[0]
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

    return getAdmin;
}

module.exports = getAdminHandler;