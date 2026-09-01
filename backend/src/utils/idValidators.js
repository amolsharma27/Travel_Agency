/**
 * Government Identity Document Verification Utility
 * Implements strict format validation and UIDAI Verhoeff algorithm for Indian IDs
 */

// Verhoeff algorithm multiplication table
const dTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// Verhoeff algorithm permutation table
const pTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

/**
 * Validate Aadhaar Number using UIDAI format rules and Verhoeff algorithm
 * Format: Exactly 12 digits, must not start with 0 or 1
 */
export const validateAadhaar = (aadhaarString) => {
  if (!aadhaarString || typeof aadhaarString !== 'string') {
    return { isValid: false, message: 'Aadhaar number is required.' };
  }

  const clean = aadhaarString.replace(/[\s\-]/g, '');

  if (!/^\d{12}$/.test(clean)) {
    return { isValid: false, message: 'Aadhaar must be exactly 12 numeric digits.' };
  }

  if (/^[01]/.test(clean)) {
    return { isValid: false, message: 'Aadhaar number cannot start with 0 or 1.' };
  }

  // Verhoeff checksum validation
  let c = 0;
  const reversedArray = clean.split('').map(Number).reverse();

  for (let i = 0; i < reversedArray.length; i++) {
    c = dTable[c][pTable[i % 8][reversedArray[i]]];
  }

  const isChecksumValid = c === 0;

  return {
    isValid: isChecksumValid,
    cleanNumber: clean,
    maskedNumber: `XXXX-XXXX-${clean.slice(8)}`,
    last4: clean.slice(8),
    message: isChecksumValid
      ? 'Valid Aadhaar number format with verified UIDAI checksum.'
      : 'Invalid Aadhaar checksum (please double-check all 12 digits).'
  };
};

/**
 * Validate Indian Passport Number
 * Format: 1 uppercase letter (A-Z) followed by 7 numeric digits (Total: 8 characters)
 */
export const validatePassport = (passportString) => {
  if (!passportString || typeof passportString !== 'string') {
    return { isValid: false, message: 'Passport number is required.' };
  }

  const clean = passportString.trim().toUpperCase().replace(/\s/g, '');

  // Standard Indian Passport format: 1 Letter followed by 7 Digits
  const passportRegex = /^[A-Z][0-9]{7}$/;

  if (!passportRegex.test(clean)) {
    return {
      isValid: false,
      message: 'Passport must start with 1 uppercase letter followed by 7 digits (e.g. K2098412).'
    };
  }

  return {
    isValid: true,
    cleanNumber: clean,
    maskedNumber: `${clean[0]}•••••${clean.slice(-2)}`,
    message: 'Valid Indian Passport number format.'
  };
};

/**
 * Validate Indian PAN Card
 * Format: 5 uppercase letters, 4 digits, 1 uppercase letter (e.g. ABCDE1234F)
 */
export const validatePAN = (panString) => {
  if (!panString || typeof panString !== 'string') {
    return { isValid: false, message: 'PAN number is required.' };
  }

  const clean = panString.trim().toUpperCase().replace(/\s/g, '');
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!panRegex.test(clean)) {
    return {
      isValid: false,
      message: 'PAN must be 5 letters, 4 digits, and 1 letter (e.g. ABCDE1234F).'
    };
  }

  return {
    isValid: true,
    cleanNumber: clean,
    maskedNumber: `${clean.slice(0, 2)}•••••${clean.slice(-2)}`,
    message: 'Valid Indian PAN card format.'
  };
};

/**
 * General multi-document validator
 */
export const validateDocument = ({ type, identifier }) => {
  const normType = (type || '').toLowerCase();
  if (normType.includes('aadhaar') || normType.includes('uidai') || normType.includes('national id')) {
    return validateAadhaar(identifier);
  } else if (normType.includes('passport')) {
    return validatePassport(identifier);
  } else if (normType.includes('pan')) {
    return validatePAN(identifier);
  }

  // Fallback generic validation
  const clean = (identifier || '').trim();
  if (clean.length < 4) {
    return { isValid: false, message: 'Document identifier must be at least 4 characters.' };
  }
  return {
    isValid: true,
    cleanNumber: clean,
    maskedNumber: clean.length > 4 ? `${clean[0]}••••${clean.slice(-2)}` : clean,
    message: 'Document format accepted.'
  };
};
