import bcrypt from "bcryptjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
}

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = req.user as JwtPayload | undefined;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes((user.role || '').toUpperCase())) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
};

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || "7d";

export const hashPassword = async (plain: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

function parseCookieToken(cookieHeader?: string) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((c) => c.trim());
  const tokenPart = parts.find((p) => p.startsWith("token="));
  if (!tokenPart) return null;
  return tokenPart.split("=")[1];
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers.authorization;
  let token: string | null = null;
  if (auth && auth.startsWith("Bearer ")) {
    token = auth.slice("Bearer ".length);
  } else {
    token = parseCookieToken(req.headers.cookie as string | undefined);
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = verifyToken(token);
    // attach to req (loose typing)
    // @ts-ignore
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
