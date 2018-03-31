let express = require('express');
let router = express.Router();

let base = require('../modules/base');
let mongoose = require("mongoose");

//调用mongodb数据库
let db = require('../models/mongodb');
let Users = require('../models/users');
let Goods = require('../models/goods');

//选择users和goods集合
let usersModel = db.model('users',Users);
let goodsModel = db.model('goods',Goods);

//获取抽奖的商品列表接口
router.get('/award',(req,res) => {

    goodsModel.find({"award.is_award": true},(err,goods) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(goods){
                res.json({
                    error_code: 0,
                    data: {
                        total: goods.length,
                        results: goods
                    }
                });
            }
        }
    });

});

//获取商品列表接口
router.get('/list',(req,res) => {

    //注意：req.query里面的值都是string类型
    //搜索关键字，分页，价格区间，区间筛选，排序方式
    let searchVal = req.query.searchVal; //搜索关键字
    let classify = req.query.classify; //商品分类
    let params = {product_name: new RegExp(searchVal)}; //查询条件
    if(classify !== "全部"){
        params.classify = classify;
    }

    let currentPage = Number(req.query.currentPage); //当前页
    let pageSize = Number(req.query.pageSize); //每页多少条数据
    let priceLevel = req.query.priceLevel; //价格区间
    let priceInterval = JSON.parse(req.query.priceInterval); //输入价格区间
    let skip = (currentPage-1) * pageSize; //跳过的数据数
    let priceGt = '',priceLte = ''; //大于区间，小于等于区间
    let sort = req.query.sort; //排序方式：升序还是倒序


    //价格筛选
    if(priceLevel !== 'all'){
        switch(priceLevel){
            case '0': priceGt = 0; priceLte = 50; break;
            case '1': priceGt = 50; priceLte = 100; break;
            case '2': priceGt = 100; priceLte = 500; break;
            case '3': priceGt = 500; priceLte = 1000; break;
            case '4': priceGt = 1000; break;
            case 'interval': priceGt = priceInterval.startPrice; priceLte = priceInterval.endPrice; break;
            default: break;
        }

        if(priceLevel === '4'){
            params.price = {
                $gt: priceGt
            };
        }else{
            params.price = {
                $gt: priceGt,
                $lte: priceLte
            };
        }
    }

    let goodsModelFind = goodsModel.find(params).skip(skip).limit(pageSize);
    if(sort !== '0'){
        if(sort === '2'){ //人气降序
            goodsModelFind.sort({popularity: -1});
        }else if(sort === '3'){ //销量降序
            goodsModelFind.sort({volume: -1});
        }else{ //价格降序或者降序
            goodsModelFind.sort({price: sort});
        }
    }
    goodsModelFind.exec((err,good) => { //exec：执行查询（前面执行完之后），并将查询结果传入回调函数
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(good){
                goodsModel.find(params,(err1,good1) => {
                    if(err1){
                        //服务器异常
                        base.serverError(err1,res);
                    }else{
                        if(good1){
                            res.json({ error_code: 0, data: { total: good1.length, results: good}});
                        }
                    }
                });

            }

        }
    });
});

//获取某个商品信息接口
router.get('/goodsDetail',(req,res) => {
    let _id = mongoose.Types.ObjectId(req.query['_id']);

    goodsModel.findOne({_id},(err,good) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(good){
                res.json({error_code: 0,data: good});
            }
        }
    });
});

module.exports = router;
