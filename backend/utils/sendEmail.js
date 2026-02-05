// sendEmail.js
import sgMail from '@sendgrid/mail';

const sendEmail = async (options) => {
    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_MAIL) {
        console.log('SendGrid not configured, skipping email send');
        return { success: false, message: 'Email service not configured' };
    }

    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
            to: options.email,
            from: process.env.SENDGRID_MAIL,
            subject: "Reset your password",
            templateId: options.templateId,
            dynamic_template_data: options.data,
        };

        await sgMail.send(msg);
        console.log('Email Sent');
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Email sending error:', error.message);
        return { success: false, message: `Email could not be sent: ${error.message}` };
    }
};

export default sendEmail;
