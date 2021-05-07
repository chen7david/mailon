const nodemailer = require('nodemailer')
const p = require('path')
const _ = require('lodash')
const fs = require('fs')

class Mailer {

    constructor(options = {}){
        this.transporter = nodemailer.createTransport(options)
    }

    from(email){
        this.from = email
        return this
    }

    to(email){
        this.to = email
        return this
    }

    toAll(emails = []){
        this.to = emails
        return this
    }

    subject(text){
        this.subject = text
        return this
    }

    body(html){
        this.body = html
        return this
    }

    async send(){
        await this.transporter.sendMail({
            from: this.from,
            to: this.to,
            subject: this.subject,
            html: this.body,
        })
    }
}

class Template {
    constructor(path){
        this.path = path
    }

    render(name, data = {}){
        const path = p.resolve(this.path, name)
        const file = fs.readFileSync(path,'utf8')
        return _.template(file)(data)
    }
}

module.exports = (options = {}, path) => async (ctx, next) => {
    ctx.template = new Template(path)
    ctx.mailer = new Mailer(options)
    await next()
}