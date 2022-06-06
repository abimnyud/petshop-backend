const getMemberHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getMember = async (req, res) => {
        const { id } = req.params;

        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message,
                    });
                } 
                
                let sql_query = `
                    SELECT * FROM members
                    WHERE member_id = ${id}
                `

                connection.query(sql_query, (err, results) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message,
                        });
                    }

                    if (results.length === 0) {
                        return res.status(404).json({
                            success: false,
                            message: 'Member not found',
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        data: results[0],
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

    return getMember;
}

module.exports = getMemberHandler;