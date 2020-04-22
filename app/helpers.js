const path = require('path');
const autobind = require('auto-bind');
const moment = require('moment-jalaali');
const momentEng = require('moment-timezone')
moment.loadPersian({usePersianDigits:true})
module.exports = class Helpers {

    constructor(req, res,next) {
        autobind(this)
        this.req = req;
        this.res = res;
        this.next = next;
        this.formData = req.flash('formData')[0];
    }
    getObjects() {
      
        return {
            auth: this.auth(),
            viewPath:this.viewPath,
            ...this.flash(),
            brandname:config.set.navbarConfig.brandname,
            adminDash:config.set.navbarConfig.adminDash,
            old:this.old,
            date:this.date,
            req:this.req,
            dateEng:this.dateEng,
            websiteurl:config.set.navbarConfig.websiteurl,
        }
    }
    auth() {
        
        return {
            // admin:this.req.user.admin,
            
            check: this.req.isAuthenticated(),
            user: this.req.user,
           admin:this.req.isAuthenticated() && this.req.user.admin
        }
        }

    viewPath(dir){
        return path.resolve(config.set.static.views+'/'+dir)
    // return{
    //     errors:this.req.flash('errors'),
    //     success:this.req.flash('success')
    //     }
    }
    flash(){
       return{
           errors:this.req.flash('errors'),
           success:this.req.flash('success')
       }
    }
    old(field,defaultValue=''){
        return this.formData && this.formData.hasOwnProperty(field) ? this.formData[field] : defaultValue;
        }
    date(time){
        return moment(time)
    }
    dateEng(time){
        return momentEng(time).tz('Asia/Tehran').locale('en').add(210,'minute')
    }

        
    
    
    
}