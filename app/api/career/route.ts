// app/api/career/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123'); // Fallback for build time

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const role = formData.get('role') as string;
    const experience = formData.get('experience') as string;
    const notes = formData.get('notes') as string;
    const resumeFile = formData.get('resume') as File;

    let resumeAttachment = null;
    
    // Convert resume file to base64 for attachment
    if (resumeFile && resumeFile.size > 0) {
      const bytes = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      
      resumeAttachment = {
        filename: resumeFile.name,
        content: base64,
      };
    }

    const emailOptions: any = {
      from: 'MRS & Co. <noreply@mrsandco.in>', // Replace with your verified domain
      to: ['camrsandco@gmail.com'],
      replyTo: email,
      subject: `New Job Application: ${role} - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #7c3aed; }
              .label { font-weight: bold; color: #6d28d9; margin-bottom: 5px; }
              .value { color: #334155; }
              .badge { display: inline-block; padding: 5px 15px; background: #ddd6fe; color: #5b21b6; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 10px; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">💼 New Job Application</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">MRS & Co. Careers</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">👤 Applicant Name</div>
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
                <div class="field">
                  <div class="label">🎯 Position Applied</div>
                  <div class="value">${role}</div>
                </div>
                ${experience ? `
                <div class="field">
                  <div class="label">⏱️ Years of Experience</div>
                  <div class="value">${experience}</div>
                </div>
                ` : ''}
                ${notes ? `
                <div class="field">
                  <div class="label">📝 Additional Notes</div>
                  <div class="value">${notes.replace(/\n/g, '<br>')}</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">📎 Resume</div>
                  <div class="value">
                    ${resumeFile && resumeFile.size > 0 
                      ? `${resumeFile.name} <span class="badge">${(resumeFile.size / 1024).toFixed(2)} KB</span>` 
                      : 'No resume attached'}
                  </div>
                </div>
                <div class="footer">
                  <p><strong>MRS & Co. Chartered Accountants</strong></p>
                  <p>Application received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Add attachment if resume exists
    if (resumeAttachment) {
      emailOptions.attachments = [resumeAttachment];
    }

    const { data, error } = await resend.emails.send(emailOptions);

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