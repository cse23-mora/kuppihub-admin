import { NextResponse } from 'next/server';

export interface ValidationRule {
  name: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: string[];
  sanitize?: boolean;
}

// Common validation patterns
export const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHANUMERIC_WITH_SPACES: /^[a-zA-Z0-9\s]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  YOUTUBE_URL: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
};

// SQL Injection patterns to detect
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION|SCRIPT)\b)/i,
  /(--)|(\/\*)|(\*\/)/,
  /(\bOR\b.*=.*)/i,
  /(\bAND\b.*=.*)/i,
];

// XSS patterns to detect
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
];

/**
 * Check for potential SQL injection
 */
export function hasSQLInjection(value: string): boolean {
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(value));
}

/**
 * Check for potential XSS
 */
export function hasXSS(value: string): boolean {
  return XSS_PATTERNS.some(pattern => pattern.test(value));
}

/**
 * Detect malicious content
 */
export function hasMaliciousContent(value: string): boolean {
  if (typeof value !== 'string') return false;
  return hasSQLInjection(value) || hasXSS(value);
}

export function validateRequest(
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): { valid: boolean; errors: string[]; sanitizedData?: Record<string, any> } {
  const errors: string[] = [];
  const sanitizedData: Record<string, any> = {};

  for (const [field, rule] of Object.entries(rules)) {
    let value = data[field];

    // Check required
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${rule.name} is required`);
      continue;
    }

    if (value === undefined || value === null || value === '') {
      continue;
    }

    // Check for array type
    if (rule.type === 'array' && !Array.isArray(value)) {
      errors.push(`${rule.name} must be an array`);
      continue;
    }

    // Check type
    if (rule.type && rule.type !== 'array' && typeof value !== rule.type) {
      errors.push(`${rule.name} must be of type ${rule.type}`);
      continue;
    }

    // String validations
    if (rule.type === 'string' && typeof value === 'string') {
      // Check for malicious content
      if (hasMaliciousContent(value)) {
        errors.push(`${rule.name} contains invalid characters`);
        continue;
      }

      // Sanitize if requested
      if (rule.sanitize !== false) {
        value = sanitizeString(value);
      }

      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${rule.name} must be at least ${rule.minLength} characters`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${rule.name} must not exceed ${rule.maxLength} characters`);
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${rule.name} format is invalid`);
      }
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${rule.name} must be one of: ${rule.enum.join(', ')}`);
      }
    }

    // Number validations
    if (rule.type === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push(`${rule.name} must be at least ${rule.min}`);
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.push(`${rule.name} must not exceed ${rule.max}`);
      }
    }

    // Array validations
    if (rule.type === 'array' && Array.isArray(value)) {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${rule.name} must have at least ${rule.minLength} items`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${rule.name} must not exceed ${rule.maxLength} items`);
      }
      // Sanitize array string items
      value = value.map((item: any) => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    }

    sanitizedData[field] = value;
  }

  return { valid: errors.length === 0, errors, sanitizedData };
}

/**
 * Sanitize string by removing potentially dangerous characters
 */
export function sanitizeString(str: string): string {
  if (typeof str !== 'string') return str;
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 10000); // Limit length
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Sanitize key name
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '');
    
    if (typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : 
        typeof item === 'object' ? sanitizeObject(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[sanitizedKey] = sanitizeObject(value);
    } else {
      sanitized[sanitizedKey] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate UUID format
 */
export function isValidUUID(id: string): boolean {
  return PATTERNS.UUID.test(id);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return PATTERNS.EMAIL.test(email);
}

/**
 * Validate URL format
 */
export function isValidURL(url: string): boolean {
  return PATTERNS.URL.test(url);
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
