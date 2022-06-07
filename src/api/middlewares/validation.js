const validation = (diHash) => {
    const {
        jwt
    } = diHash;

    const verifyToken = (req, res, next) => {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access Denied'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Token'
            });
        }
    }

    return verifyToken;
}

module.exports = validation;