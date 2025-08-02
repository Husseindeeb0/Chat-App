import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateAccessToken = (userId: string, res: Response): string => {
  const isDev = process.env.NODE_ENV === 'development';
  const accessSecret = process.env.ACCESS_SECRET_TOKEN;

  if (!accessSecret) {
    throw new Error(
      "ACCESS_SECRET_TOKEN is not defined in environment variables"
    );
  }

  const accessToken = jwt.sign({ userId: userId }, accessSecret, {
    expiresIn: "1d",
  });

  res.cookie("access_token", accessToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // Prevents XSS atatcks cross-site scripting attacks
    sameSite: isDev ? "strict" : "none", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return accessToken;
};

export const generateRefreshToken = (userId: string, res: Response): string => {
  const isDev = process.env.NODE_ENV === 'development';
  const refreshSecret = process.env.REFRESH_SECRET_TOKEN;

  if (!refreshSecret) {
    throw new Error(
      "REFRESH_SECRET_TOKEN is not defined in environment variables"
    );
  }

  const refreshToken = jwt.sign({ userId: userId }, refreshSecret, {
    expiresIn: "7d",
  });

  res.cookie("refresh_token", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isDev ? "strict" : "none",
    secure: process.env.NODE_ENV !== "development",
  });

  return refreshToken;
};

