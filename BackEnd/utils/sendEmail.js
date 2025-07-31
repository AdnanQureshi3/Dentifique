
import { Resend } from 'resend';

export const resend = new Resend(process.env.Resend_API_KEY);

export async function sendVerificationEmail(email, username, code) {
  try {

    await resend.emails.send({
      from: 'UpChain <onboarding@resend.dev>',
      to: ['adnanq262@gmail.com' , 'adnanquresh262@gmail.com'],
      subject: 'Verify your Email',
      html:`
       <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #0d6efd;">Hello ${username},</h2>
      <p>Thank you for signing up. Please use the following OTP to verify your email address:</p>
      <div style="font-size: 24px; font-weight: bold; background: #f1f1f1; padding: 12px 20px; border-radius: 6px; text-align: center; letter-spacing: 4px; margin: 20px 0;">
        ${code}
      </div>
      <p>Your email is ${email}. Please verify it.</p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
      <p style="margin-top: 30px;">Best regards,<br />The UpChain Team</p>
    </div>`

    });

    console.log('Verification email sent successfully');
  } catch (err) {
    throw new Error('Email send failed');
  }
}
export async function sendReportEmail(user, description, postId, type, reason, author) {
  try {
    await resend.emails.send({
      from: 'UpChain <onboarding@resend.dev>',
      to: ['adnanq262@gmail.com'],
      subject: '🚨 New Report Submitted on UpChain',
      html: `
        <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.6; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <h2 style="color: #dc3545;">⚠️ Content Report Notification</h2>
            <p><strong>${user}</strong> has reported a <strong>${type}</strong> on the platform.</p>
            <p><strong>Reason for Report:</strong> ${reason}</p>
            <p><strong>Additional Description:</strong> ${description || 'N/A'}</p>
            <hr />
            <p><strong>Post ID:</strong> ${postId}</p>
            <p><strong>Author of Reported Post:</strong> ${author}</p>
            <p style="margin-top: 30px;">Please review this report and take necessary action if required.</p>
            <p style="color: #6c757d; font-size: 0.9em;">This is an automated message from the UpChain Report System.</p>
          </div>
        </div>
      `
    });

    console.log('Report email sent successfully');
  } catch (err) {
    throw new Error('Email send failed');
  }
}
