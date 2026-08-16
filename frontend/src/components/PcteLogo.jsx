import React from 'react';
import pcteLogo from '../assets/pcte-logo.png';

/**
 * PcteLogo — renders the official PCTE Travel Agency logo image.
 *
 * Props:
 *  className  - Tailwind sizing class  (default: 'h-10 w-auto')
 *  variant    - 'default' | 'white' | 'dark'
 *
 *  'default'  → light background  — mix-blend-mode:multiply removes white bg
 *  'white'    → dark background   — mix-blend-mode:screen makes white bg transparent,
 *                                   logo colours show through on dark surface
 *  'dark'     → always full-colour, no blend  (e.g. coloured card header)
 */
const PcteLogo = ({
  className = 'h-10 w-auto',
  variant = 'default',
  alt = 'PCTE Travel Agency',
}) => {
  let style = { objectFit: 'contain', display: 'block' };

  if (variant === 'default') {
    // Light background — multiply removes the white pixels
    style.mixBlendMode = 'multiply';
  } else if (variant === 'white') {
    // Dark background — screen makes the white bg transparent
    style.mixBlendMode = 'screen';
  }
  // 'dark' variant → no blend needed

  return (
    <img
      src={pcteLogo}
      alt={alt}
      className={className}
      style={style}
      draggable={false}
    />
  );
};

export default PcteLogo;
