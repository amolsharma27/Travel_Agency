// Generates a 6-digit numeric OTP as a string.
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const otpExpiryDate = () => {
  const minutes = Number(process.env.OTP_EXPIRE_MINUTES || 10);
  return new Date(Date.now() + minutes * 60 * 1000);
};

export const otpEmailTemplate = (name, otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
    <h2 style="color:#0f172a;">Password Reset OTP</h2>
    <p>Hi ${name || 'there'},</p>
    <p>Use the OTP below to reset your password. It is valid for
      ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.</p>
    <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px;
      background:#f1f5f9; padding: 16px; text-align:center; border-radius: 8px;">
      ${otp}
    </div>
    <p style="color:#64748b; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
  </div>
`;
