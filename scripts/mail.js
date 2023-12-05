const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

class Mail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })
        this.transporter.use('compile', hbs({
            viewEngine: {
                extname: '.hbs',
                layoutsDir: './views/',
                defaultLayout: false,
                partialsDir: './views/partials/',
            },
            viewPath: './views/',
            extName: '.hbs'
        }))
    }

    async sendShippingEmail(emailAddr, order, items) {
    const info = await this.transporter.sendMail({
        from: 'fa2023.csci467.group1a@gmail.com',
        to: emailAddr,
        subject: 'Your order has shipped',
        template: 'email',
        context: {
            order : order, items : items
        }
    })

    console.log('Message sent: %s', info.messageId)
    }
}

module.exports = Mail