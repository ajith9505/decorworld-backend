const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthroized' })

    const accessToken = authHeader.split(' ')[1]

    try {
        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            (error, decoded) => {
                if (error) return res.status(403).json({ message: 'Forbidden' })
                req.user = decoded.user
                next()
            }
        )
    } catch (error) {
        console.log(error);
    }
}

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send("Not authorized as an admin.");
    }
};

module.exports = {
    authenticate,
    authorizeAdmin
}