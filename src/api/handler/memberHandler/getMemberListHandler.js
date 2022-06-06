const getMemberListHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const getMemberList = async (req, res) => {
        const { 
            direction = "asc",
            page = 1,
            length = 10
        } = req.query;
        
        const start = (page - 1) * (length);
        const sortBy = "created_at";

        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({
                        message: err.message,
                    });
                } 
                
                let sql_query = `
                    SELECT  members.member_id, members.name, members.phone, members.points,
                    (
                        SELECT COUNT(*) AS total_orders
                        FROM orders
                        WHERE orders.member_id = members.member_id
                    ) AS total_orders,
                    members.created_at, members.updated_at
                    FROM members
                    ORDER BY ${sortBy} ${direction}
                    LIMIT ${start}, ${length};
                    SELECT COUNT(*) AS total FROM members;
                `

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
                        data: results[0],
                        meta: {
                            page: Number(page),
                            length: Number(length) > results[1][0].total ? results[1][0].total : Number(length),
                            total: results[1][0].total
                        }
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

    return getMemberList;
}

module.exports = getMemberListHandler;