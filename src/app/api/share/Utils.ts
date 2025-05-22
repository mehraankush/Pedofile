import { Resend } from 'resend';
import { IDocument } from '@/models/Document';
import { ObjectId } from 'mongodb';


export interface DocumentWithId extends IDocument {
  _id?: string
}

interface SendShareEmailProps {
  recipientEmail?: string
  title: string;
  documentId: ObjectId | string
  senderName: string
  baseUrl: string
}


const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendShareEmail(
  title: string,
  documentId: ObjectId | string,
  senderName: string,
) {
  try {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const emailHtml = generateEmailTemplate({
      title,
      documentId,
      senderName,
      baseUrl,
    })

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "ankushmehra.dev@gmail.com",
      subject: `${senderName} shared a document with you`,
      html: emailHtml,
    })

    if (error) {
      console.error("Error sending email with Resend:", error)
      throw error
    }

    console.log("Email sent successfully with Resend ID:", data?.id)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}


export const generateEmailTemplate = ({
  title,
  documentId,
  senderName,
  baseUrl,
}: SendShareEmailProps) => {
  const documentLink = `${baseUrl}/shared/${documentId}`

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document Shared With You</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f9fafb; color: #111827;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                <!-- Header -->
                <tr>
                  <td style="padding: 32px 40px; text-align: center; background-color: #f3f4f6; border-radius: 8px 8px 0 0;">
                    <img src="${baseUrl}/logo.png" alt="Logo" style="height: 40px; margin-bottom: 16px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">Document Shared With You</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #374151;">
                      Hello,
                    </p>
                    <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #374151;">
                      <strong>${senderName}</strong> has shared a document with you.
                    </p>
                    
                    <!-- Document Card -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 32px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                      <tr>
                        <td style="padding: 24px;">
                          <h2 style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #111827;">${title}</h2>
                          <p style="margin: 0 0 16px; font-size: 14px; line-height: 20px; color: #6b7280;">${'You Attenstion needed to this document'}</p>
                          <a href="${documentLink}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 500; border-radius: 6px; font-size: 14px; margin-top: 16px;">View Document</a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #374151;">
                      You can access this document at any time by clicking the button above or using this link:
                    </p>
                    <p style="margin: 0 0 32px; font-size: 14px; line-height: 20px; color: #6b7280; word-break: break-all;">
                      <a href="${documentLink}" style="color: #4f46e5; text-decoration: underline;">${documentLink}</a>
                    </p>
                    
                    <p style="margin: 0; font-size: 16px; line-height: 24px; color: #374151;">
                      Thank you,<br>
                      The Team
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; text-align: center; background-color: #f3f4f6; border-radius: 0 0 8px 8px;">
                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                      If you didn't expect to receive this email, you can safely ignore it.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
}


export async function sendResetEmail(email: string, link: string) {
  try {

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "ankushmehra.dev@gmail.com",
      subject: "Reset your password",
      html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
    })

    console.log("EMail Status", data)
    if (error) {
      console.error("Error sending email with Resend:", error)
      throw error
    }
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;

  }
  return true
}