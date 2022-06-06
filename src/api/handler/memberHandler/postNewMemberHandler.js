
const postNewMemberHandler = (diHash) => {
    const {
        pool,
    } = diHash;
    
    const postNewMember = async (req, res) => {
        const { 
            name, phone 
        } = req.body;

        if (!name || !phone) {
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

            const query = `CALL usp_NewMember('${name}','${phone}')`;

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

    return postNewMember;
}

module.exports = postNewMemberHandler;