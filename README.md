# Mailon

#### V2
usage in koa js
1. <code>$ npm i lodash nodemailer</code>

config.yaml
```yaml
server:
  protocol: http
  hostname: localhost
  port: 5000

email:
  service: gmail
  auth:
    user: 'mailer@email.com'
    pass: yourpassword
```

```js
const Koa = require('koa')
const app = new Koa()
const mailer = require('mailon')
const { server, email } = require('config')

app.use(mailer(email, __dirname + '/public'))

/* SERVER */
app.listen(server.port, () => {
    const http = require('url').format(server)
    console.log(`server running at: ${http}`)
})
```

#### controllers 
```js
async requestPasswordRecovery(ctx){
    const code = await ctx.state.$user.newPasswordRecoveryCode()
    if(!code) ctx.cargo.original(ctx.request.body).state('validation')
    .loadmsg('code', 'invalid code').error(422)
    await ctx.mailer
        .to(ctx.state.$user.email)
        .subject('Password Revocery Code')
        .body(ctx.template.render('email-verification.html', code))
        .send()
    ctx.body = ctx.cargo.msg(`password recovery email sent to ${ctx.state.$user.email}`)
}
```

#### V1
Mailon is a templating engine for tempate emails. 

### Getting Started

#### 1. Create Templates
Create a template folder anywhere in your project folder. All template files should end in <code>.html</code>. We should stick to the following naming convention <code>filename.langcode.html</code>. The langcode will be used to retrieve the correct translation of the email if your app supports it. 

Example Filenames
```js
const exampleFileNameEnglish = 'welcome.en.html'
const exampleFileNameChinese = 'welcome.zh.html'
```

Example Welcome Email in English: welcome.en.html

```html
<h1>Welcome to company.name</h1>
<p>you have created a new account, below are your account credentials:</p>
<ul>
    <li>username: ${user.username}</li>
    <li>password: ${user.password}</li>
</ul>

For more information please click <a href="${link}">here</a>
```

Example Welcome Email in Chinese: welcome.en.html

```html
<h1>账户主次成功</h1>
<p>下边是您账户信息:</p>
<ul>
    <li>用户名: ${user.username}</li>
    <li>密码: ${user.password}</li>
</ul>

更多信息， 请按<a href="${link}">here</a>
```

#### 2. Setting up Mailon
```js
const { mailon } = require('./mailmap')
const instance = mailon('path-where-you-store-your-templates')
instance.langTo('zh')
```

#### 3. Getting and rendering emails with Mailon
```js
instance.get('welcome', data)
```

output

```html
<h1>账户主次成功</h1>
<p>下边是您账户信息:</p>
<ul>
    <li>用户名: some-username</li>
    <li>密码: some-password</li>
</ul>

更多信息， 请按<a href="some-link">here</a>
```

#### 4. Express Middleware Example
Note: if you wish to set the langue you will have set a lang property on your request object before instantiating notis.

```js
const mailon = require('./mailmap')('path-where-you-store-your-templates')

// mount to express app
app.use(mailon())


// accessing in express route

const SomeExpressRoute = async (req, res, next) => {

    const data = {
        user: { ... },
        invoice: { ... }
    }

    const email = req.mailon.get('some-email-template', data)

    next()

}
```
