module.exports = (container) => {
    const accessTokenService = container.get('accessTokenService');

    return (req, res, next) => {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(403).json({
                error: 'Authorization header is missing',
            });
        }

        const [type, token] = header.split(' ');

        if (type !== 'Bearer' || !token) {
            return res.status(401).json({
                error: 'Invalid Authorization header format',
            });
        }

        try {
            req.auth = accessTokenService.verify(token); // { sub, email }

            next();
        } catch (err) {
            return res.status(401).json({
                error: 'Invalid or expired access token',
            });
        }
    };
};