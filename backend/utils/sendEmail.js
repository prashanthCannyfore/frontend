// sendEmail.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
    try {
        const msg = {
            to: options.email,
            from: process.env.SENDGRID_MAIL,
            subject: "Reset your password",

            templateId: options.templateId,
            dynamic_template_data: options.data,
        };

        await sgMail.send(msg);
        console.log('Email Sent');
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error(`Email could not be sent: ${error.message}`);
    }
};

export default sendEmail;
