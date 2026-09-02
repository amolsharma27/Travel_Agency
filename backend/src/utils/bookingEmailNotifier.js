import sendEmail from './sendEmail.js';

const ADMIN_NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'pcte_travels@pcte.edu.in';

/**
 * Formats a date nicely for email display
 */
const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(date);
  }
};

/**
 * Sends both Admin Alert & Customer Confirmation emails when any booking is created or updated
 *
 * @param {Object} details
 * @param {string} details.bookingReference - e.g. PKG-12345, HTL-8821, MEA-9281
 * @param {string} details.bookingType - 'Tour Package' | 'Hotel / Stay' | 'Flight' | 'Train' | 'Bus' | 'Activity' | 'Passport' etc.
 * @param {string} details.itemTitle - Title of package, hotel name, route, activity, etc.
 * @param {string} [details.destination] - Destination or city
 * @param {string} details.customerName - Customer name
 * @param {string} details.customerEmail - Customer email
 * @param {string} details.customerPhone - Customer contact phone
 * @param {Date|string} [details.travelDate] - Travel date / check-in date
 * @param {Date|string} [details.returnDate] - Return date / check-out date
 * @param {number|string} [details.travellersCount] - Count of guests / seats / passengers
 * @param {string} [details.selectedOption] - Room type, bus seat type, slot time, etc.
 * @param {number} details.totalAmount - Total amount in INR
 * @param {string} [details.paymentStatus] - 'paid' | 'pending' | 'mock'
 * @param {string} [details.status] - 'confirmed' | 'pending_approval' | 'pending_payment'
 * @param {string} [details.specialNotes] - Any special instructions / pickup location
 */
export const notifyBooking = async ({
  bookingReference,
  bookingType = 'Tour & Travel',
  itemTitle,
  destination = '',
  customerName = 'Traveler',
  customerEmail,
  customerPhone = 'N/A',
  travelDate,
  returnDate,
  travellersCount = 1,
  selectedOption,
  totalAmount = 0,
  paymentStatus = 'Paid',
  status = 'Confirmed',
  specialNotes,
}) => {
  const formattedTravelDate = formatDate(travelDate);
  const formattedReturnDate = returnDate ? formatDate(returnDate) : null;
  const capitalizedType = bookingType.charAt(0).toUpperCase() + bookingType.slice(1);
  const amountFormatted = Number(totalAmount).toLocaleString('en-IN');

  // ============================================================
  // 1. ADMIN / TRAVEL DESK NOTIFICATION (amolsharma2705@gmail.com)
  // ============================================================
  const adminSubject = `🚨 New ${capitalizedType} Booking: ${bookingReference || 'Ref'} - ${itemTitle || 'Reservation'} (₹${amountFormatted})`;

  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b;">
      <div style="background: linear-gradient(135deg, #0F2942 0%, #1E1B4B 100%); padding: 24px; color: #ffffff; text-align: left;">
        <span style="background-color: #E11D48; color: #ffffff; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px;">New Booking Alert</span>
        <h1 style="margin: 12px 0 4px 0; font-size: 22px; font-weight: 800; color: #ffffff;">PCTE Travel Agency Desk</h1>
        <p style="margin: 0; font-size: 13px; color: #cbd5e1;">A new reservation has been placed on the platform.</p>
      </div>

      <div style="padding: 24px;">
        <div style="background-color: #f8fafc; border-left: 4px solid #E11D48; padding: 14px 18px; border-radius: 8px; margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Booking Reference</div>
          <div style="font-size: 20px; font-weight: 800; color: #0F2942; letter-spacing: 0.5px;">${bookingReference || 'CONFIRMED'}</div>
        </div>

        <h3 style="font-size: 15px; font-weight: 700; color: #0F2942; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Reservation Particulars</h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b; width: 38%;">Category / Type:</td>
            <td style="padding: 9px 0; font-weight: 600; color: #0F2942;">${capitalizedType}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b;">Item / Service:</td>
            <td style="padding: 9px 0; font-weight: 700; color: #0F2942;">${itemTitle || 'N/A'}</td>
          </tr>
          ${destination ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b;">Destination:</td>
            <td style="padding: 9px 0; font-weight: 600; color: #0F2942;">${destination}</td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b;">Travel / Service Date:</td>
            <td style="padding: 9px 0; font-weight: 600; color: #0F2942;">${formattedTravelDate}${formattedReturnDate ? ` to ${formattedReturnDate}` : ''}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b;">Guests / Travellers:</td>
            <td style="padding: 9px 0; font-weight: 600; color: #0F2942;">${travellersCount} Person(s)</td>
          </tr>
          ${selectedOption ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b;">Option / Slot / Room:</td>
            <td style="padding: 9px 0; font-weight: 600; color: #0F2942;">${selectedOption}</td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b;">Total Amount:</td>
            <td style="padding: 9px 0; font-size: 16px; font-weight: 800; color: #E11D48;">₹${amountFormatted}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b;">Booking Status:</td>
            <td style="padding: 9px 0; font-weight: 700; color: #16a34a; text-transform: uppercase;">${status} (${paymentStatus})</td>
          </tr>
        </table>

        <h3 style="font-size: 15px; font-weight: 700; color: #0F2942; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Customer Contact Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b; width: 38%;">Customer Name:</td>
            <td style="padding: 9px 0; font-weight: 700; color: #0F2942;">${customerName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b;">Customer Email:</td>
            <td style="padding: 9px 0; font-weight: 600;"><a href="mailto:${customerEmail}" style="color: #2563eb; text-decoration: none;">${customerEmail || 'Not provided'}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b;">Customer Phone:</td>
            <td style="padding: 9px 0; font-weight: 600;"><a href="tel:${customerPhone}" style="color: #2563eb; text-decoration: none;">${customerPhone}</a></td>
          </tr>
          ${specialNotes ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 9px 0; color: #64748b;">Notes / Special Req:</td>
            <td style="padding: 9px 0; font-weight: 500; color: #334155;">${specialNotes}</td>
          </tr>` : ''}
        </table>
      </div>

      <div style="background-color: #0F2942; color: #94a3b8; padding: 16px 24px; text-align: center; font-size: 11px;">
        PCTE Travel Agency Platform Telemetry · Notification recipient: <b>${ADMIN_NOTIFICATION_EMAIL}</b>
      </div>
    </div>
  `;

  const adminText = `
=== NEW BOOKING NOTIFICATION ===
Reference: ${bookingReference}
Category: ${capitalizedType}
Item/Service: ${itemTitle}
Destination: ${destination || 'N/A'}
Travel Date: ${formattedTravelDate}${formattedReturnDate ? ` to ${formattedReturnDate}` : ''}
Travellers: ${travellersCount}
Total Amount: ₹${amountFormatted}
Status: ${status} (${paymentStatus})

--- CUSTOMER DETAILS ---
Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
Notes: ${specialNotes || 'None'}
================================
  `.trim();

  // Send admin notification
  try {
    await sendEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: adminSubject,
      text: adminText,
      html: adminHtml,
    });
  } catch (err) {
    console.error('Failed to dispatch admin booking notification:', err.message);
  }

  // ============================================================
  // 2. CUSTOMER CONFIRMATION EMAIL (if customerEmail is provided)
  // ============================================================
  if (customerEmail && customerEmail.includes('@')) {
    const customerSubject = `✈️ Booking Confirmed: ${itemTitle} (Ref: ${bookingReference})`;

    const customerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #0F2942 0%, #1B1464 100%); padding: 26px; color: #ffffff; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">🎉</div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">Booking Confirmed!</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #e2e8f0;">Thank you for choosing PCTE Travel Agency, <b>${customerName}</b>.</p>
        </div>

        <div style="padding: 24px;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; text-align: center; margin-bottom: 22px;">
            <span style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">Your Booking Reference</span>
            <div style="font-size: 22px; font-weight: 900; color: #15803d; letter-spacing: 1px; margin-top: 2px;">${bookingReference}</div>
          </div>

          <h3 style="font-size: 15px; font-weight: 700; color: #0F2942; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Reservation Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 22px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 0; color: #64748b; width: 40%;">Service / Trip:</td>
              <td style="padding: 9px 0; font-weight: 700; color: #0F2942;">${itemTitle}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 0; color: #64748b;">Travel / Check-in Date:</td>
              <td style="padding: 9px 0; font-weight: 600; color: #0F2942;">${formattedTravelDate}${formattedReturnDate ? ` to ${formattedReturnDate}` : ''}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 0; color: #64748b;">Travellers / Guests:</td>
              <td style="padding: 9px 0; font-weight: 600; color: #0F2942;">${travellersCount}</td>
            </tr>
            ${selectedOption ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 0; color: #64748b;">Selected Option:</td>
              <td style="padding: 9px 0; font-weight: 600; color: #0F2942;">${selectedOption}</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 0; color: #64748b;">Total Amount:</td>
              <td style="padding: 9px 0; font-size: 16px; font-weight: 800; color: #E11D48;">₹${amountFormatted}</td>
            </tr>
          </table>

          <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; font-size: 12px; color: #475569; line-height: 1.6;">
            <div style="font-weight: 700; color: #0F2942; margin-bottom: 4px;">Need Assistance or Have Questions?</div>
            Our travel coordinators are ready to help you 24/7.<br/>
            📞 <b>Phone & WhatsApp:</b> +91 99881 10021<br/>
            📧 <b>Support Email:</b> <a href="mailto:amolsharma2705@gmail.com" style="color: #2563eb;">amolsharma2705@gmail.com</a>
          </div>
        </div>

        <div style="background-color: #0F2942; color: #94a3b8; padding: 14px 20px; text-align: center; font-size: 11px;">
          PCTE Travel Agency — Freedom To Evolve · Official Campus Desk, Baddowal, Ludhiana
        </div>
      </div>
    `;

    const customerText = `
Dear ${customerName},

Your booking with PCTE Travel Agency is confirmed!

Booking Reference: ${bookingReference}
Service/Trip: ${itemTitle}
Travel Date: ${formattedTravelDate}${formattedReturnDate ? ` to ${formattedReturnDate}` : ''}
Travellers: ${travellersCount}
Total Amount: ₹${amountFormatted}

If you need any help, contact us anytime at +91 99881 10021 or email amolsharma2705@gmail.com.

Thank you,
PCTE Travel Agency Team
    `.trim();

    try {
      await sendEmail({
        to: customerEmail,
        subject: customerSubject,
        text: customerText,
        html: customerHtml,
      });
    } catch (err) {
      console.error('Failed to dispatch customer booking confirmation:', err.message);
    }
  }
};

export default notifyBooking;
