const deleteAdminHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const deleteAdmin = async (req, res) => {        
        const { id } = req.params;
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                } 

                let sql_query = `CALL usp_DeleteAdmin(${id});`;
                connection.query(`SELECT * FROM admins WHERE admin_id=${id}`, (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            sucess: false,
                            message: err.message,
                        });
                    }

                    if (results.length === 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'Admin not found',
                        });
                    } else if (results[0].status === 'inactive') {
                        return res.status(400).json({
                            success: false,
                            message: 'Admin is already inactive',
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

    return deleteAdmin;
}

module.exports = deleteAdminHandler;