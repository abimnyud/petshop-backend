const verifyAPIKey = (diHash) => {
    const {
        jwt
    } = diHash;

    const verifyKey = (req, res, next) => {
        const api_key = req.headers['x-api-key'];
        if (!api_key) {
            return res.status(401).json({
                success: false,
                message: 'Access Denied'
            });
        }

        if (api_key === process.env.API_KEY) {
            next()
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid API Key'
            });
        }
    }

    return verifyKey;
}

module.exports = verifyAPIKey;