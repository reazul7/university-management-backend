import config from '../config'
import nodemailer from 'nodemailer'
export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: config.node_env === 'production',
        auth: {
            user: `${config.mail_username}`,
            pass: `${config.mail_app_password}`,
        },
    })

    await transporter.sendMail({
        from: `${config.mail_username}`, // sender address
        to, // list of receivers
        subject: 'Reset your password within 10 minutes!', // Subject line
        text: '', // plain text body
        html, // html body
    })
}
