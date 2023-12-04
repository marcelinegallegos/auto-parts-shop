const nodemailer = require("nodemailer")

class Mail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })
    }

    async sendShippingEmail(email) {
    const info = await this.transporter.sendMail({
        from: "fa2023.csci467.group1a@gmail.com",
        to: email,
        subject: "Your order has shipped",
        text: "Hello world?",
        html: "<b>Hello world?</b>",
    })

    console.log("Message sent: %s", info.messageId)
    }
}

module.exports = Mail