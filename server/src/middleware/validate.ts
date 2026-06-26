import type { Request, Response, NextFunction } from "express";

type ValidationRule = {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  allowedValues?: string[];
};

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && (value === undefined || value === null || value === "")) {
        errors.push(`${rule.field} is required`);
        continue;
      }

      if (value === undefined || value === null || value === "") continue;

      const str = String(value);

      if (rule.minLength && str.length < rule.minLength) {
        errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
      }

      if (rule.maxLength && str.length > rule.maxLength) {
        errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
      }

      if (rule.isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(str)) {
          errors.push(`${rule.field} must be a valid email address`);
        }
      }

      if (rule.allowedValues && !rule.allowedValues.includes(str)) {
        errors.push(`${rule.field} must be one of: ${rule.allowedValues.join(", ")}`);
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ message: errors[0] });
      return;
    }

    next();
  };
};
