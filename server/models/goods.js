//商品信息
let mongoose = require('mongoose');

let goodsSchema = new mongoose.Schema({
    "product_name": String, //商品名称
    "classify": {type: String,default: ''}, //商品分类
    "price": {type: Number,default: 0}, //商品价格
    "product_image": {type: Array,default: ['noImg.gif']}, //商品图片
    "product_num": {type: Number,default: 0}, //商品库存
    "volume": {type: Number,default: 0}, //商品销量
    "popularity": {type: Number,default: 0}, //商品人气
    "cart_num": {type: Number,default: 0}, //加入购物车数量
    "collect_num": {type: Number,default: 0}, //商品收藏数量
    "grade": {type: Number,default: 0}, //商品评分
    "detail": String, //商品详情
    //商品属性
    "attr": [
        {
            "name": String, //属性名称
            "value": Array, //属性的值
        }
    ],
    //商品评价
    "comment": [
        {
            "nickName": String, //用户名
            "grade": {type: Number,default: 0}, //分数等级
            "content": {type: String,default: ''}, //评价内容
            "time": {type: Date,default: Date.now()}, //评价时间
        }
    ],
    //抽奖商品
    "award": {
        "is_award": {type: Boolean,default: false}, //是否是抽奖商品
        "people_num": {type: Number,default: 0}, //抽中人数
        "award_limit": {type: Number,default: 0}, //抽奖名额
        "award_num": {type: Number,default: 0}, //已参加抽奖人数
        "time": {type : Date,default: Date.now()}, //抽奖时间
        "time_end": {type : Date,default: Date.now()}, //截止时间
        "attr": [ //抽奖商品属性
            {
                "name": String, //属性名称
                "value": Array //属性的值
            }

        ]
    }
});

module.exports = goodsSchema;
