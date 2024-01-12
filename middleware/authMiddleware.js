const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const AuthMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                error: 'Token not found, authentication failed:('
            });
        }

        const getTokenFromRequest = (req) => {
            const authorization = req.get('authorization');
            if (authorization && authorization.toLowerCase().startsWith('bearer')) {
                 return authorization.substring(7);
            }
            return null;
        };

        try {
            jwt.verify(getTokenFromRequest(req), JWT_SECRET, (error, decodedToken) => {
                if (error) {
                    if (error.name === 'TokenExpiredError') {
                        return res.status(401).json({ error: 'Token expired, authentication failed:(' });
                    } else {
                        return res.status(401).json({ error: 'Token invalid, authentication failed:(' });
                    }
                }

                req.userId = decodedToken.id;
                next();
            });
        } catch (err) {
            return res.status(401).json({
                error: err.message
            });
        }
    }
};

module.exports = AuthMiddleware;
