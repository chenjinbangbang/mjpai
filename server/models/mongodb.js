/*====================================连接mongodb数据库====================================*/
//调用mongoose
let mongoose = require('mongoose');

//连接mongodb数据库（db_demo）
let db = mongoose.createConnection('mongodb://localhost:27017/mjpai');

//判断数据库是否连接成功
db.on('connected',() => {
    console.log('mongodb数据库连接成功！');
});
//判断数据库是否连接失败
db.on('error',() => {
    console.log('mongodb数据库连接失败！');
});
//判断数据库是否连接断开
db.on('disconnectged',() => {
    console.log('mongodb数据库连接断开！');
});

module.exports = db;
