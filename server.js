//cd D:\Programming\WEB\Node-CMS
require('app-module-path').addPath(__dirname)


require('dotenv').config();
global.config = require('./config')
const App = require('app/index')
new App();
