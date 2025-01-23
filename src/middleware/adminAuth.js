const jwt = require("jsonwebtoken")
import Admin from "../models/admin.js"
const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const admin = await Admin.findByPk(decoded.adminId)

    if (!admin) {
      throw new Error()
    }

    req.admin = admin
    next()
  } catch (error) {
    res.status(401).json({ message: "Please authenticate as admin" })
  }
}

export default adminAuthMiddleware