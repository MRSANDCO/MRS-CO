// app/api/consultation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123'); // Fallback for build time

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { name, email, phone, company, service, message } = formData;

    const { data, error } = await resend.emails.send({
      from: 'MRS & Co. <noreply@mrsandco.in>', // Replace with your verified domain
      to: ['camrsandco@gmail.com'],
      replyTo: email,
      subject: `New Consultation Request from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #2563eb; }
              .label { font-weight: bold; color: #1e40af; margin-bottom: 5px; }
              .value { color: #334155; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🔔 New Consultation Request</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">MRS & Co. Website</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">👤 Name</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">📧 Email</div>
                  <div class="value">${email}</div>
                </div>
                ${phone ? `
                <div class="field">
                  <div class="label">📱 Phone</div>
                  <div class="value">${phone}</div>
                </div>
                ` : ''}
                ${company ? `
                <div class="field">
                  <div class="label">🏢 Company</div>
                  <div class="value">${company}</div>
                </div>
                ` : ''}
                ${service ? `
                <div class="field">
                  <div class="label">🎯 Service Requested</div>
                  <div class="value">${service}</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">💬 Message</div>
                  <div class="value">${message.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="footer">
                  <p><strong>MRS & Co. Chartered Accountants</strong></p>
                  <p>Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}