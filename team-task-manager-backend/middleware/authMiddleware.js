const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔥 Check header exist
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // 🔥 Extract token
    const token = authHeader.split(" ")[1];

    // 🔥 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Attach user
    req.user = decoded;

    next();

  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = protect;