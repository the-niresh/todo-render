import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  const token = req.cookies["jwt-todo-pro"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No Token Provided" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
    const user = await User.findById(decodedToken.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log("Error in protectRoute middleware", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
