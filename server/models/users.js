//用户信息
let mongoose = require('mongoose');

//设置数据类型
let usersSchema = new mongoose.Schema({
    "nickName": String, //昵称
    "username": String, //用户名（手机号码）
    "password": String, //密码
    "portrait": String, //头像
    "sex": {type: String,default: "保密"}, //性别
    "name": String, //真实姓名
    "register_time": {type: Date,default: Date.now()}, //注册时间
    "account": {type: Number,default: 0}, //账户余额
    "integral": {type: Number,default: 0}, //用户积分
    "grade": {type: Number,default: 0}, //分数等级
    "last_login_time": {type: Date,default: Date.now()}, //最新登录时间
    "sign_time": {type: Date,default: Date.now()}, //签到的时间
    "sign_days_num": {type: Number,default: 0}, //连续签到次数
    "sign_days_total": {type: Number,default: 0}, //总共签到次数
    "get_integral": {type: Number,default: 1},//每天签到所获得的积分数
    "generalizeList": Array, //推广记录
    //购物车列表
    "cartList": [
        {
            "product_name": String, //商品名称
            "price": {type: Number,default: 0}, //商品价格
            "product_image": {type: Array,default: ['noImg.gif']}, //商品图片
            "product_num": {type: Number,default: 0}, //商品库存
            "volume": {type: Number,default: 0}, //商品销量
            "popularity": {type: Number,default: 0}, //商品人气
            "cart_num": {type: Number,default: 0}, //用户加入购物车数量
        }
    ],
    //收货地址列表
    "addressList": [
        {
            "address_id" : Number, //地址id
            "name" : String, //姓名
            "province" : String, //省份
            "city" : String, //城市
            "area" : String, //区域
            "street" : String, //详细地址
            "phone" : String, //电话号码
            "post_code" : String, //邮编
            "email": String, //电子邮箱
            "is_default" : Boolean //是否默认
        }
    ],
    "orderList": [ //订单列表
        {
            "product_name": String, //商品名称

        }
    ],
});

module.exports = usersSchema;
