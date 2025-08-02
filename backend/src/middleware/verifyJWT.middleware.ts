import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Define the shape of JWT payload
interface JWTPayload {
  userId: string;
}

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    const accessSecret = process.env.ACCESS_SECRET_TOKEN;
    if (!accessSecret) {
      throw new Error(
        "ACCESS_SECRET_TOKEN is not defined in environment variables"
      );
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }
    jwt.verify(
      token,
      accessSecret,
      (
        error: jwt.VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined
      ) => {
        if (error) {
          return res
            .status(403)
            .json({
              status: "failed",
              message: `Unauthorized: ${error.message}`,
            });
        }

        // Type guard to ensure decoded is an object and has userId
        if (decoded && typeof decoded === "object" && "userId" in decoded) {
          req.userId = (decoded as JWTPayload).userId;
          next();
        } else {
          return res
            .status(403)
            .json({ status: "failed", message: "Invalid token payload" });
        }
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export default verifyJWT;
