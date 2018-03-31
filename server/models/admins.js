
//管理员信息
let mongoose = require('mongoose');

let adminsSchema = new mongoose.Schema({
    "adminName": String, //账号
    "adminPwd": String //密码
});

module.exports = adminsSchema;
