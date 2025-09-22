# main.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="CA Firm Contact API",
    description="API for handling contact and booking forms",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Email configuration from environment variables
EMAIL_CONFIG = {
    "smtp_server": os.getenv("SMTP_SERVER", "smtp.gmail.com"),
    "smtp_port": int(os.getenv("SMTP_PORT", "587")),
    "sender_email": os.getenv("SENDER_EMAIL"),
    "sender_password": os.getenv("SENDER_PASSWORD"),
    "receiver_email": os.getenv("RECEIVER_EMAIL"),  # CA firm's email
}

# Pydantic models for request validation
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: str
    subject: str
    message: str
    
    @field_validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip()
    
    @field_validator('phone')
    def validate_phone(cls, v):
        # Remove spaces and hyphens
        cleaned = v.replace(" ", "").replace("-", "")
        if not cleaned.isdigit() or len(cleaned) < 10:
            raise ValueError('Invalid phone number')
        return cleaned
    
    @field_validator('message')
    def validate_message(cls, v):
        if len(v.strip()) < 10:
            raise ValueError('Message must be at least 10 characters long')
        return v.strip()

class BookingForm(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company_name: Optional[str] = None
    service_type: str
    preferred_date: str
    preferred_time: str
    additional_notes: Optional[str] = ""
    
    @field_validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip()
    
    @field_validator('phone')
    def validate_phone(cls, v):
        cleaned = v.replace(" ", "").replace("-", "")
        if not cleaned.isdigit() or len(cleaned) < 10:
            raise ValueError('Invalid phone number')
        return cleaned
    
    @field_validator('service_type')
    def validate_service(cls, v):
        valid_services = [
            "Tax Consultation",
            "Audit Services",
            "Business Registration",
            "GST Registration",
            "Income Tax Filing",
            "Financial Advisory",
            "Other"
        ]
        if v not in valid_services:
            raise ValueError(f'Invalid service type. Must be one of: {", ".join(valid_services)}')
        return v

class EmailResponse(BaseModel):
    success: bool
    message: str

# Email sending function
async def send_email(subject: str, html_content: str, recipient: str = None):
    """
    Send email using SMTP
    """
    try:
        # Use default receiver if not specified
        if recipient is None:
            recipient = EMAIL_CONFIG["receiver_email"]
        
        # Check if email configuration is complete
        if not all([EMAIL_CONFIG["sender_email"], EMAIL_CONFIG["sender_password"], recipient]):
            raise ValueError("Email configuration is incomplete. Check environment variables.")
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = EMAIL_CONFIG["sender_email"]
        msg['To'] = recipient
        
        # Add HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Send email
        with smtplib.SMTP(EMAIL_CONFIG["smtp_server"], EMAIL_CONFIG["smtp_port"]) as server:
            server.starttls()
            server.login(EMAIL_CONFIG["sender_email"], EMAIL_CONFIG["sender_password"])
            server.send_message(msg)
        
        logger.info(f"Email sent successfully to {recipient}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise

# HTML email templates
def create_contact_email_template(form_data: ContactForm) -> str:
    """
    Create HTML template for contact form email
    """
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #2c3e50; color: white; padding: 20px; text-align: center; }}
            .content {{ background-color: #f9f9f9; padding: 20px; margin-top: 20px; }}
            .field {{ margin-bottom: 15px; }}
            .label {{ font-weight: bold; color: #2c3e50; }}
            .value {{ margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #3498db; }}
            .footer {{ margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>New Contact Form Submission</h2>
                <p>Received on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
            </div>
            <div class="content">
                <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">{form_data.name}</div>
                </div>
                <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">{form_data.email}</div>
                </div>
                <div class="field">
                    <div class="label">Phone:</div>
                    <div class="value">{form_data.phone}</div>
                </div>
                <div class="field">
                    <div class="label">Subject:</div>
                    <div class="value">{form_data.subject}</div>
                </div>
                <div class="field">
                    <div class="label">Message:</div>
                    <div class="value">{form_data.message}</div>
                </div>
            </div>
            <div class="footer">
                <p>This email was automatically generated from your website's contact form.</p>
            </div>
        </div>
    </body>
    </html>
    """

def create_booking_email_template(form_data: BookingForm) -> str:
    """
    Create HTML template for booking form email
    """
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #27ae60; color: white; padding: 20px; text-align: center; }}
            .content {{ background-color: #f9f9f9; padding: 20px; margin-top: 20px; }}
            .field {{ margin-bottom: 15px; }}
            .label {{ font-weight: bold; color: #27ae60; }}
            .value {{ margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #2ecc71; }}
            .highlight {{ background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }}
            .footer {{ margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>New Consultation Booking Request</h2>
                <p>Received on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
            </div>
            <div class="content">
                <div class="highlight">
                    <strong>📅 Appointment Details:</strong><br>
                    Date: {form_data.preferred_date}<br>
                    Time: {form_data.preferred_time}
                </div>
                <div class="field">
                    <div class="label">Client Name:</div>
                    <div class="value">{form_data.name}</div>
                </div>
                <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">{form_data.email}</div>
                </div>
                <div class="field">
                    <div class="label">Phone:</div>
                    <div class="value">{form_data.phone}</div>
                </div>
                {f'''<div class="field">
                    <div class="label">Company Name:</div>
                    <div class="value">{form_data.company_name}</div>
                </div>''' if form_data.company_name else ''}
                <div class="field">
                    <div class="label">Service Required:</div>
                    <div class="value">{form_data.service_type}</div>
                </div>
                {f'''<div class="field">
                    <div class="label">Additional Notes:</div>
                    <div class="value">{form_data.additional_notes}</div>
                </div>''' if form_data.additional_notes else ''}
            </div>
            <div class="footer">
                <p>Please contact the client to confirm the appointment.</p>
                <p>This email was automatically generated from your website's booking form.</p>
            </div>
        </div>
    </body>
    </html>
    """

# API Endpoints
@app.get("/")
async def root():
    """
    Root endpoint to check if API is running
    """
    return {
        "message": "CA Firm API is running",
        "endpoints": {
            "contact": "/api/contact",
            "booking": "/api/book-consultation",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    email_configured = all([
        EMAIL_CONFIG["sender_email"],
        EMAIL_CONFIG["sender_password"],
        EMAIL_CONFIG["receiver_email"]
    ])
    
    return {
        "status": "healthy",
        "email_configured": email_configured,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/contact", response_model=EmailResponse)
async def submit_contact_form(
    form_data: ContactForm,
    background_tasks: BackgroundTasks
):
    """
    Handle contact form submission
    """
    try:
        # Create email content
        subject = f"New Contact Form: {form_data.subject}"
        html_content = create_contact_email_template(form_data)
        
        # Send email in background
        background_tasks.add_task(send_email, subject, html_content)
        
        logger.info(f"Contact form received from {form_data.email}")
        
        return EmailResponse(
            success=True,
            message="Thank you for contacting us. We will get back to you soon."
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request. Please try again later."
        )

@app.post("/api/book-consultation", response_model=EmailResponse)
async def submit_booking_form(
    form_data: BookingForm,
    background_tasks: BackgroundTasks
):
    """
    Handle consultation booking form submission
    """
    try:
        # Create email content
        subject = f"New Booking: {form_data.service_type} - {form_data.name}"
        html_content = create_booking_email_template(form_data)
        
        # Send email in background
        background_tasks.add_task(send_email, subject, html_content)
        
        logger.info(f"Booking request received from {form_data.email} for {form_data.service_type}")
        
        return EmailResponse(
            success=True,
            message=f"Your consultation for {form_data.preferred_date} at {form_data.preferred_time} has been requested. We will confirm shortly."
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing booking form: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your booking. Please try again later."
        )

# Exception handlers
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return {
        "success": False,
        "message": str(exc),
        "error_type": "validation_error"
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return {
        "success": False,
        "message": "An unexpected error occurred. Please try again later.",
        "error_type": "server_error"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)