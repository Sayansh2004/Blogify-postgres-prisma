import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
      
        const token = req.cookies.token; 

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

       
        req.user = { id: decoded.id };

        
        next(); 

    } catch (err) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
}

