import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { handleHttpError } from "../utils/handleError.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return handleHttpError(res, "NO_TOKEN", 401);

        const token = authHeader.split(" ").pop();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return handleHttpError(res, "USER_NOT_FOUND", 404);

        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        handleHttpError(res, "NOT_AUTHENTICATED", 401);
    }
};

export default authMiddleware;
