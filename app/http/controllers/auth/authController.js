const Controller = require('app/http/controllers/controller');
const activeUser = require('app/models/activeUser');
const passport = require('passport');
const uniqueString = require('unique-string');
const transporter = require('app/helper/mail');
const Category = require('app/models/Category')
class registerController extends Controller {
    async register(req, res) {
        let categories = await Category.find({})
        res.render('auth/signup', {
            categories,
            title:'ایجاد حساب',
            recap: this.recaptcha.render()
        })
    }
    async login(req, res) {
        let categories = await Category.find({})
        res.render('auth/login', {
            categories,
            title:'ورود',
            recap: this.recaptcha.render(),
        })
    }
    async registerProccess(req, res, next) {
        
        // await this.recaptchValidation(req,res);
        
        let result = await this.validationData(req)
        
        if(result){
            return this.registerSignup(req,res,next)
        } else {
            req.flash('errors','Error!')
        return res.redirect('/auth/signup')
        }
    }
    async loginProccess(req, res, next) {

        // await this.recaptchValidation(req,res);

        let result = await this.validationData(req)
        if(result){
            return  this.loginPassport(req,res,next)
        } else{
        return res.redirect('/auth/login')

        }
    }
    
    registerSignup(req, res, next) {
        passport.authenticate('local.register',async (err,user)=>{
            if(err) this.error('خطایی رخ داده است',500)
            
                    let token = uniqueString()
                    let newActCode = new activeUser({
                    user:user.id,
                    token,
                    expire:Date.now() + 1000 * 60 * 15
                })
                await newActCode.save()
          
                let options = {
                    from: '"Ligiato" <info@ligiato.com>', // sender address
                    to: `${user.email}`, // list of receivers
                    subject: "فعال سازی حساب", // Subject line
                    text:'حساب کاربری لیجیاتو',
                    html:`
                    <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="x-apple-disable-message-reformatting">
	<title>Activiaton Account-Ligiato</title>

</head>

<body width="100%" style="
			margin: 0 auto !important;
			padding: 0 !important;
			height: 100% !important;
			width: 100% !important;
			background: #f1f1f1;
			font-weight: normal;
			font-family: 'Vazir';
			@font-face {
  font-family: Vazir;
  src: url('https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.eot');
  src: url('https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.eot?#iefix') format('embedded-opentype'),
       url('https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.woff2') format('woff2'),
       url('https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.woff') format('woff'),
       url('https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.ttf') format('truetype');
  font-weight: normal;
}
			">
	<center style="width: 100%; background-color: #f1f1f1;">
		<div
			style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
			&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
		</div>
		<div style="max-width: 600px; margin: 0 auto;" style="min-width: 370px;">
			<table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
				style="margin: auto;">
				<tr>
					<td valign="top" style="padding: 1em 2.5em;background-color: #6a1b9a;">
						<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
							<tr>

								<td width="100%" style="text-align: center;font-size: 13px;">
									<h1><a href="http://ligiato.com" style="color:white;text-decoration: none !important;">لیجیاتو</a>
									</h1>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td style="text-align:center;height: 300px;background-color: white;padding: 2.5em;">
						<div style="color: black;">
							<h2 style="color: #000;
			font-size: 24px;
			margin-top: 0;
			line-height: 1.4;
			font-weight: 700">فعال سازی حساب</h2>
							<p>برای فعال سازی حساب کاربری خود روی لینک زیر کلیک کنید</p>
							<p> <a href="${config.websiteurl}/auth/activeuser/${newActCode.token}"" style="padding: 5px 15px;
			display: inline-block;
			border-radius: 5px;
			background: #6a1b9a;
			text-decoration: none !important;
			color: #fff">فعال سازی</a></p>
						</div>
					</td>
				</tr>
			</table>
			<table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
				style="margin: auto;">
				<tr>
					<td valign="middle" style="text-align: center; padding: 2.5em;background-color: white;">

						<p>All Rights Reserved &copy;2020. <a href="http://ligiato.com" style="text-decoration: none;" target="_blank" rel="noopener noreferrer">Ligiato.com</a></p>
					</td>
				</tr>
			</table>
			</td>
			</tr>
			</table>
		</div>
	</center>
</body>

</html>
                    `,
                };
                transporter.sendMail(options,(err,info)=>{
                    if(err) return this.error('خطایی رخ داده',500)
                    this.alertMessage(req,{
                        title:'لینک فعال سازی اکانت برای شما ارسال شد!',
                        timer:20000,
                        button:true,
                        type:'success',
                        message:null,
                    })
                    return res.redirect('/auth/login')
                    
                })
                return;
        })(req, res, next)

    }
    loginPassport(req, res, next) {
        passport.authenticate('local.login',async (err, user) => {
            if (! user) return res.redirect('/auth/login')
            
            if(! user.active){
                let activeCode = await activeUser.find({user:user.id}).gt('expire',new Date()).sort({createdAt:-1}).limit(1).exec()
                if(activeCode.length){
                    this.alertBack(req,res,{
                        title:'اکانت شما فعال نیست:(',
                        message:'برای ارسال دوباره کد فعال سازی 15 دقیقه صبر کنید!',
                        timer:6000,
                        type:'error',
                        button:null,
                    })
                    return;
                }
                else {
                    let token = uniqueString()
                    let newActCode = new activeUser({
                    user:user.id,
                    token,
                    expire:Date.now() + 1000 * 60 * 15
                })
                await newActCode.save()
                let options = {
                    from: '"Ligiato" <info@ligiato.com>', // sender address
                    to: `${user.email}`, // list of receivers
                    subject: "فعال سازی حساب", // Subject line
                  text:'حساب کاربری لیجیاتو',
                    html:`
                    <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="x-apple-disable-message-reformatting">
	<title>Activiaton Account-Ligiato</title>

</head>

<body width="100%" style="
			margin: 0 auto !important;
			padding: 0 !important;
			height: 100% !important;
			width: 100% !important;
			background: #f1f1f1;
			font-weight: normal;
			font-family: 'Vazir';
			@font-face {
  font-family: Vazir;
  src: url('https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.eot');
  src: url('https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.eot?#iefix') format('embedded-opentype'),
       url('https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.woff2') format('woff2'),
       url('https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.woff') format('woff'),
       url('https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.ttf') format('truetype');
  font-weight: normal;
}
			">
	<center style="width: 100%; background-color: #f1f1f1;">
		<div
			style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
			&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
		</div>
		<div style="max-width: 600px; margin: 0 auto;" style="min-width: 370px;">
			<table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
				style="margin: auto;">
				<tr>
					<td valign="top" style="padding: 1em 2.5em;background-color: #6a1b9a;">
						<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
							<tr>

								<td width="100%" style="text-align: center;font-size: 13px;">
									<h1><a href="http://ligiato.com" style="color:white;text-decoration: none !important;">لیجیاتو</a>
									</h1>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td style="text-align:center;height: 300px;background-color: white;padding: 2.5em;">
						<div style="color: black;">
							<h2 style="color: #000;
			font-size: 24px;
			margin-top: 0;
			line-height: 1.4;
			font-weight: 700">فعال سازی حساب</h2>
							<p>برای فعال سازی حساب کاربری خود روی لینک زیر کلیک کنید</p>
							<p> <a href="${config.websiteurl}/auth/activeuser/${newActCode.token}"" style="padding: 5px 15px;
			display: inline-block;
			border-radius: 5px;
			background: #6a1b9a;
			text-decoration: none !important;
			color: #fff">فعال سازی</a></p>
						</div>
					</td>
				</tr>
			</table>
			<table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
				style="margin: auto;">
				<tr>
					<td valign="middle" style="text-align: center; padding: 2.5em;background-color: white;">

						<p>All Rights Reserved &copy;2020. <a href="http://ligiato.com" style="text-decoration: none;" target="_blank" rel="noopener noreferrer">Ligiato.com</a></p>
					</td>
				</tr>
			</table>
			</td>
			</tr>
			</table>
		</div>
	</center>
</body>

</html>
                    `,
                };
                transporter.sendMail(options,(err)=>{
                    if(err) this.error('خطایی رخ داده',500)
                    this.alertMessage(req,{
                        title:'با موفقیت لینک فعال سازی اکانت برای شما ارسال شد!',
                        timer:5000,
                        button:null,
                        type:'success',
                        message:null,
                    })
                    return res.redirect('/')
                    
                })
                return;
                }

               
                
            } else{
            req.logIn(user, err => {

                if (req.body.remember) {
                    user.setRememberToken(res)
                }
              if(err){
                  return res.json(err)
              }

              return res.redirect('/')
    
            })
            }
        })(req, res, next)
    }
    async active(req,res,next){
        try {
            
            let actCode = await activeUser.findOne({token:req.params.token}).populate('user').exec()
            if(! actCode){
                this.alertMessage(req,{
                    title:'هشدار',
                    message:'چنین لینک فعال سازی وجود ندارد',
                    type:'error',
                    timer:null,
                    button:'خب',
                })
                return res.redirect('/')
            }
            if(actCode.expire < new Date()){
                this.alertMessage(req,{
                    title:'هشدار',
                    message:'مهلت استفاده از لینک به اتمام رسیده',
                    type:'error',
                    timer:null,
                    button:'خب',
                })
                return res.redirect('/')
            }
            if(actCode.used){
                this.alertMessage(req,{
                    title:'هشدار',
                    message:'مهلت استفاده از لینک به اتمام رسیده',
                    type:'error',
                    timer:null,
                    button:'خب',
                })
                return res.redirect('/')
            }
            let user = actCode.user;
            user.$set({active:true})
            actCode.$set({used:true})
            await user.save()
            await actCode.save()
            req.logIn(user, err => {

                user.setRememberToken(res)
              this.alertMessage(req,{
                    title:'با تشکر',
                    message:'حساب کاربری شما فعال گردید!',
                    type:'success',
                    timer:6000,
                    button:'خب',
                })
              return res.redirect('/')
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new registerController();