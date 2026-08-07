import Razorpay from 'razorpay';

export const razorpayEnabled = Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
);

let instance = null;

if (razorpayEnabled) {
  instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('Razorpay: connected');
} else {
  console.log('Razorpay: no credentials set, payment endpoints will return mock sandbox orders');
}

export default instance;
