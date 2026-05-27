import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User = require("../models/User");

type UserRole = "admin" | "technician" | "viewer";

type DecodedToken = JwtPayload & {
  id: string;
};

type AuthRequest = Request & {
  user?: any;
};

// Protects private routes using JWT
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        return res.status(500).json({
          message: "JWT_SECRET is not defined",
        });
      }

      const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "Not authorized, user not found",
        });
      }

      return next();
    } catch {
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};

// Allows only specific roles to access a route
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Not authorized for this action",
      });
    }

    next();
  };
};
