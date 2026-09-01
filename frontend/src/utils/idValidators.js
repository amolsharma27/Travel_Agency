/**
 * Government Identity Document Verification Utility for Frontend
 * Provides real-time format validation, auto-formatting, and UIDAI Verhoeff algorithm
 */

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
 * Validates Indian Aadhaar Number
 */
export const validateAadhaar = (aadhaarString) => {
  if (!aadhaarString || typeof aadhaarString !== 'string') {
    return { isValid: false, message: 'Aadhaar number is required.' };
  }

  const clean = aadhaarString.replace(/[\s\-]/g, '');

  if (!/^\d{12}$/.test(clean)) {
    return {
      isValid: false,
      message: 'Aadhaar must be exactly 12 numeric digits.',
      cleanNumber: clean
    };
  }

  if (/^[01]/.test(clean)) {
    return {
      isValid: false,
      message: 'Aadhaar number cannot start with 0 or 1.',
      cleanNumber: clean
    };
  }

  // Verhoeff checksum algorithm
  let c = 0;
  const reversedArray = clean.split('').map(Number).reverse();

  for (let i = 0; i < reversedArray.length; i++) {
    c = dTable[c][pTable[i % 8][reversedArray[i]]];
  }

  const isChecksumValid = c === 0;

  return {
    isValid: isChecksumValid,
    cleanNumber: clean,
    formattedNumber: `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)}`,
    maskedNumber: `XXXX-XXXX-${clean.slice(8)}`,
    last4: clean.slice(8),
    message: isChecksumValid
      ? 'Verified Aadhaar format (UIDAI Checksum Passed)'
      : 'Invalid Aadhaar checksum (please verify all 12 digits).'
  };
};

/**
 * Validates Indian Passport Number
 * Format: 1 uppercase letter (A-Z) + 7 digits (0-9)
 */
export const validatePassport = (passportString) => {
  if (!passportString || typeof passportString !== 'string') {
    return { isValid: false, message: 'Passport number is required.' };
  }

  const clean = passportString.trim().toUpperCase().replace(/\s/g, '');
  const passportRegex = /^[A-Z][0-9]{7}$/;

  if (!passportRegex.test(clean)) {
    return {
      isValid: false,
      message: 'Passport must start with 1 uppercase letter followed by 7 digits (e.g. K2098412).',
      cleanNumber: clean
    };
  }

  return {
    isValid: true,
    cleanNumber: clean,
    maskedNumber: `${clean[0]}•••••${clean.slice(-2)}`,
    message: 'Verified Indian Passport format.'
  };
};

/**
 * Validates Indian PAN Card
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
      message: 'PAN must be 5 letters, 4 digits, and 1 letter (e.g. ABCDE1234F).',
      cleanNumber: clean
    };
  }

  return {
    isValid: true,
    cleanNumber: clean,
    maskedNumber: `${clean.slice(0, 2)}•••••${clean.slice(-2)}`,
    message: 'Verified Indian PAN card format.'
  };
};

/**
 * Auto-formats Aadhaar input with spaces (e.g. 1234 5678 9012)
 */
export const formatAadhaarInput = (value) => {
  const digits = (value || '').replace(/\D/g, '').slice(0, 12);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(' ');
};

/**
 * Auto-formats Passport input in uppercase
 */
export const formatPassportInput = (value) => {
  return (value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
};
