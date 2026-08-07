import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Verifies the JWT and attaches the authenticated user to req.user
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user no longer exists');
    }

    if (req.user.status === 'blocked') {
      res.status(403);
      throw new Error('Your account has been blocked. Contact support.');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }
});

// Restricts a route to one or more roles, e.g. authorize('admin', 'agency')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role '${req.user?.role || 'unknown'}' is not permitted to access this resource`);
    }
    next();
  };
};

// For agency-only routes: also ensures the agency profile is approved by admin
export const requireApprovedAgency = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'agency') {
    res.status(403);
    throw new Error('Only travel agencies can access this resource');
  }
  if (req.user.agencyStatus !== 'approved') {
    res.status(403);
    throw new Error('Your agency account is pending admin approval');
  }
  next();
});
