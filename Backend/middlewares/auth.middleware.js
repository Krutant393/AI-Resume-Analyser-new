    const jwt = require('jsonwebtoken');





    const authMiddleware = (req, res, next) => {


        const token = req.cookies.token;



        if (token) {

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    res.status(401).json({ message: 'Invalid token' });
                } else {
                    req.user = decoded;
                    next();
                }
            });
        }





    }