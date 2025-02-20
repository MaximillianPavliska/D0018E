import jwt from "jsonwebtoken";
import db from "../../db.js";

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [user] = await db.execute('SELECT * FROM users WHERE UserID = ?', [decoded.userId]);
      req.user = user[0];
      next();
    } catch (error) {
      res.status(401).send({ error: 'Please authenticate.' });
    }
  };

  export default authenticate;
