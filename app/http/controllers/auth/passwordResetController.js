const controller = require('app/http/controllers/controller')
const User = require('app/models/User')
const Category = require('app/models/Category')
const PasswordReset = require('app/models/PasswordReset')
const uniqueString = require('unique-string')
const transporter = require("app/helper/mail");
const bcrypt = require('bcryptjs')
class passwordResetController extends controller {
	async showForm(req, res) {
		let categories = await Category.find({})
		res.render('auth/resetpassword', {
			categories,
			title: 'فراموشی رمز عبور',
			recap: this.recaptcha.render(),
		})
	}
	async passwordResetProcess(req, res) {
		if (!req.originalUrl == '/panel') {
			// await this.recaptchValidation(req,res);
		}
		let result = await this.validationData(req)
		if (result) {
			return this.postedForm(req, res)
		}
		return this.alertBack(req, res, {
			title: 'دقت کنید',
			message: 'مشکلی در فرم وجود دارد!',
			timer: 5000,
			type: 'error',
			button: null,
		});

	}

	async postedForm(req, res) {
		let user = await User.findOne({
			email: req.body.email
		})
		if (!user) {
			return this.alertBack(req, res, {
				title: 'هشدار',
				message: 'اطلاعات کاربر یافت نشد!',
				timer: 6000,
				type: 'error',
				button: null,
			})
		}
		const newPasswordReset = new PasswordReset({
			email: req.body.email,
			token: uniqueString(),
		})
		await newPasswordReset.save()
		let options = {
			from: '"Ligiato" <info@ligiato.com>', // sender address
			to: `${newPasswordReset.email}`, // list of receivers
			subject: "بازیابی کردن رمز عبور", // Subject line
			text: 'بازیابی کردن رمز عبور',
			html: `
        <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="x-apple-disable-message-reformatting">
	<title>Reset Password Account-Ligiato</title>

</head>

<body width="100%" style="
			margin: 0 auto !important;
			padding: 0 !important;
			height: 100% !important;
			width: 100% !important;
			background: #f1f1f1;
			font-weight: normal;">
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
			font-weight: 700">فراموشی رمز عبور</h2>
							<p style="text-align: right;">این ایمیل بنا به درخواست شما در خصوص فراموشی رمز عبور حساب کاربری تان ارسال شده است. برای بازیابی رمز عبور بر روی لینک زیر کلیک کنید</p>
							<p> <a href="${config.websiteurl}/auth/forget/${newPasswordReset.token}" style="padding: 5px 15px;
			display: inline-block;
			border-radius: 5px;
			background: #6a1b9a;
			text-decoration: none !important;
			color: #fff">بازیابی</a></p>
						</div>
						<p style="text-align: right;">اگر این درخواست را شما ارسال نکردید لطفا از این ایمیل صرف نظر کنید</p>
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
		transporter.sendMail(options, (err) => {
			if (err) return this.error('خطایی رخ داده', 500)
		})

		this.alertMessage(req, {
			title: 'ایمیل با موفقیت ارسال شد',
			message: null,
			timer: 3000,
			type: 'success',
			button: null,
		})
		return res.redirect('/auth/login')
	}

}

module.exports = new passwordResetController();