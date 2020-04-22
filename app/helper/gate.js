const ConnectRoles = require('connect-roles');
const Permission = require('app/models/Permission')
let gate = new ConnectRoles({
  failureHandler: function (req, res, action) {
    // optional function to customise code that runs when
    // user fails authorisation
    let accept = req.headers.accept || '';
    res.status(403);
    res.locals.layout = 'errors/master'
    if (accept.indexOf('html')) {
      res.render('errors/403',{
        message:'شما دسترسی به این بخش ندارید!',
        
      })
    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});
const permissions = async()=>{
    return await Permission.find({}).populate('roles').exec()
}
permissions()
    .then(permissions=>{
        permissions.forEach(permission=>{
            let roles = permission.roles.map(item=>item._id)

            gate.use(permission.label,(req)=> {
            return (req.isAuthenticated())
                ? req.user.hasRole(roles)
                : false
            })
        })
    })
    .catch(err=>console.log(err))

module.exports = gate;