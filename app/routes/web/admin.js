const express = require('express');
const router = express.Router();
const gate = require('app/helper/gate');
const csrf = require('csurf')
//Controller
const adminController = require('app/http/controllers/admin/adminController');
const postsController = require('app/http/controllers/admin/postsController');
const commentController = require('app/http/controllers/admin/commentController');
const categoryController = require('app/http/controllers/admin/categoryController');
const userController = require('app/http/controllers/admin/userController');
const permissionController = require('app/http/controllers/admin/permissionController');
const roleController = require('app/http/controllers/admin/roleController');
const singleController = require('app/http/controllers/admin/singleController');
//Helper
const uploadPost = require('app/helper/uploadPost');
const uploadCategory = require('app/helper/uploadCategory');
const uploadSingle = require('app/helper/uploadSingle');
const uploadCk = require('app/helper/uploadCk');
//Validator
const postValidator = require('app/validator/postValidator');
const categoryValidator = require('app/validator/categoryValidator');
const permissionValidator = require('app/validator/permissionValidator');
const roleValidator = require('app/validator/roleValidator');
const singleValidator = require('app/validator/singleValidator');
//Middleware
const redirectifadmin = require('app/http/middlewares/redirectifadmin')
const convertFile = require('app/http/middlewares/convertFile')
const csrfProtection = csrf({ cookie: true });
const csrfHandler = require('app/http/middlewares/csrfHandler')
router.use(redirectifadmin.handle)
//Previews
router.use((req,res,next)=>{
    res.locals.layout = "admin/previews"
    next()
})
router.get('/posts/previews/:id',csrfProtection,adminController.previews)
router.use(csrfHandler.handler)
//End-Previews
router.use((req,res,next)=>{
    res.locals.layout = "admin/master"
    next()
})

////////////////////
//Admin Home
router.get('/',adminController.index)
//Posts
router.get('/posts',gate.can('show-posts'),postsController.index);
router.get('/posts/create',gate.can('create-post'),postsController.createPost)
router.post('/posts/create',gate.can('create-post'),uploadPost.single('images'),convertFile.handle,postValidator.handle(),postsController.create)
router.delete('/posts/:id',gate.can('delete-post'),postsController.destory)
router.get('/posts/edit/:id',gate.can('edit-post'),postsController.getEdit)
router.put('/posts/edit/:id',gate.can('edit-post'),uploadPost.single('images'),convertFile.handle,postValidator.handle(),postsController.editPost)
router.post('/ckupload-image',gate.can('edit-post'),uploadCk.single('upload'),adminController.uploadimage)
//Category
router.get('/categories',gate.can('get-categories'),categoryController.index)
router.get('/categories/create',gate.can('create-categories'),categoryController.createCategory)
router.post('/categories/create',gate.can('create-categories'),uploadCategory.single('images'),categoryController.file,categoryValidator.handle(),categoryController.create)
router.delete('/categories/:id',gate.can('delete-categories'),categoryController.destory)
router.get('/categories/edit/:id',gate.can('edit-categories'),categoryController.getEdit)
router.put('/categories/edit/:id',gate.can('edit-categories'),uploadCategory.single('images'),categoryController.file,categoryValidator.handle(),categoryController.editCategory) 
//Permissions-create-categories-get-permissions'
router.get('/users/permissions',gate.can('get-permissions'),permissionController.index)
router.get('/users/permissions/create',gate.can('create-permissions'),permissionController.createPermission)
router.post('/users/permissions/create',gate.can('create-permissions'),permissionValidator.handle(),permissionController.create)
router.delete('/users/permissions/:id',gate.can('delete-permissions'),permissionController.destory)
router.get('/users/permissions/edit/:id',gate.can('edit-permissions'),permissionController.getEdit)
router.put('/users/permissions/edit/:id',gate.can('edit-permissions'),permissionValidator.handle(),permissionController.editPermission) 
//Roles
// get-roles
router.get('/users/roles',gate.can('get-roles'),roleController.index)
router.get('/users/roles/create',gate.can('create-roles'),roleController.createRole)
router.post('/users/roles/create',gate.can('create-roles'),roleValidator.handle(),roleController.create)
router.delete('/users/roles/:id',gate.can('delete-roles'),roleController.destory)
router.get('/users/roles/edit/:id',gate.can('edit-roles'),roleController.getEdit)
router.put('/users/roles/edit/:id',gate.can('edit-roles'),roleValidator.handle(),roleController.editRole) 
//Comments
router.get('/comments',gate.can('show-comments'),commentController.index)
router.get('/comments/approved',gate.can('show-approved-comments'),commentController.approved)
router.delete('/comments/:id',gate.can('delete-comment'),commentController.destory)
router.put('/comments/approved/:id',gate.can('approved-comment'),commentController.update)
//Analyse
router.get('/analyse',gate.can('get-analyse'),adminController.analyse)
//Users-get-users-admin-user-addrole-user
router.get('/users',gate.can('get-users'),userController.index)
router.delete('/users/:id',gate.can('admin-user'),userController.destory)
router.get('/users/toggleadmin/:id',gate.can('admin-user'),userController.toggleadmin)
router.get('/users/create',gate.can('get-users'),userController.getCreate)
router.post('/users/create',gate.can('get-users'),userController.create)
router.get('/users/:id/addrole',gate.can('addrole-user'),userController.addrole)
router.put('/users/:id/addrole',gate.can('addrole-user'),userController.storeRoleForUser)
//Single
router.get('/single-pages',gate.can('get-singles'),singleController.index)
router.get('/single-pages/create',gate.can('create-singles'),singleController.createSingle)
router.post('/single-pages/create',gate.can('create-singles'),uploadSingle.single('images'),singleController.file,singleValidator.handle(),singleController.create)
router.get('/single-pages/edit/:id',gate.can('edit-singles'),singleController.getEdit)
router.put('/single-pages/edit/:id',gate.can('edit-singles'),uploadSingle.single('images'),singleController.file,singleValidator.handle(),singleController.editSingle)
router.delete('/single-pages/:id',gate.can('delete-singles'),singleController.destory)
////////////////////
// gate.can('delete-user'),


module.exports = router;