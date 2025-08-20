const jwt = require("jsonwebtoken");

const JWT_SECRET = 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; //Ejemplo: Bearer <token>
    const token = authHeader && authHeader.split(' ')[1]; //Ejemplo [ 'Bearer', 'token' ]

    if (!token) {
        return res.status(401).json({message: 'Token de acceso requerido'});
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({message: 'Token inválido'});
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken, JWT_SECRET};