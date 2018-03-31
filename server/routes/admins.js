let express = require('express');
let router = express.Router();

let base = require('../modules/base');
let mongoose = require("mongoose");

//hash算法加密
let hash = require('../modules/hash');

//调用mongodb数据库
let db = require('../models/mongodb');
let Admins = require('../models/admins');
let Users = require('../models/users');
let Goods = require('../models/goods');

//选择admins集合
let adminsModel = db.model('admins',Admins);
let usersModel = db.model('users',Users);
let goodsModel = db.model('goods',Goods);

router.get('/',(req,res) => {
    res.json({name: 111,age: 222})
});

//登录管理员接口
router.post('/login',(req,res) => {
    let params = req.body;
    //console.log(params);
    params.password = hash(params.password);

    adminsModel.findOne(params,(err,admin) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            if(admin){
                res.json({error_code: 0,data: {adminName: admin.adminName}});
            }else{
                res.json({error_code: 1,data: {}});
            }
        }
    });
});

/*========================================用户管理接口==========================================================*/
//获取所有用户接口
router.get('/users/list',(req,res) => {

    console.log(req.query);

    //查询昵称
    let search = req.query.search;
    let params = {nickName: new RegExp(search)};

    //排序
    let sortField = req.query.sortField;
    let sort = req.query.sort;

    //分页
    let page = Number(req.query.page); //当前页
    let limit = Number(req.query.limit); //一页有多少条数据
    let skip = (page-1) * limit; //跳过的数据数

    let usersModelFind = usersModel.find(params).skip(skip).limit(limit);

    if(sort !== undefined){
        switch(sortField){
            case 'nickName':
                if(sort === 'ascending'){usersModelFind.sort({nickName: 1});}
                else {usersModelFind.sort({nickName: -1});}
                break;
            case 'username':
                if(sort === 'ascending'){usersModelFind.sort({username: 1});}
                else {usersModelFind.sort({username: -1});}
                break;
            case 'sex':
                if(sort === 'ascending'){usersModelFind.sort({sex: 1});}
                else {usersModelFind.sort({sex: -1});}
                break;
            case 'registerTime':
                if(sort === 'ascending'){usersModelFind.sort({register_time: 1});}
                else {usersModelFind.sort({register_time: -1});}
                break;
            case 'account':
                if(sort === 'ascending'){usersModelFind.sort({account: 1});}
                else {usersModelFind.sort({account: -1});}
                break;
            case 'grade':
                if(sort === 'ascending'){usersModelFind.sort({grade: 1});}
                else {usersModelFind.sort({grade: -1});}
                break;
            case 'lasstLoginTime':
                if(sort === 'ascending'){usersModelFind.sort({last_login_time: 1});}
                else {usersModelFind.sort({last_login_time: -1});}
                break;
            case 'signTime':
                if(sort === 'ascending'){usersModelFind.sort({sign_time: 1});}
                else {usersModelFind.sort({sign_time: -1});}
                break;
            default:
                break;
        }
    }

    usersModelFind.exec((err,users) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            if(users){
                console.log(typeof users[0].register_time);
                res.json({error_code: 0,data: {total: users.length,results: users}});
            }
        }
    });
});

//添加用户接口
router.post('/users/create',(req,res) => {
    let params = req.body;
    params.password = hash(params.password);

    let user = new usersModel(params);
    user.save((err,user) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            if(user){
                res.json({ error_code: 0, data: {}});
            }
        }
    });
});

//获取某个用户信息接口
router.get('/users/info',(req,res) => {
    let _id = mongoose.Types.ObjectId(req.query['_id']); //把String类型的_id转化为ObjectId类型的_id

    usersModel.findOne({_id},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            if(user){
                res.json({
                    error_code: 0,
                    data: {
                        _id: user["_id"],
                        nickName: user.nickName,
                        username: user.username,
                        password: user.password,
                        sex: user.sex
                    }
                });
            }
        }
    });
});

//修改用户接口
router.post('/users/update',(req,res) => {
    let params = req.body.params;
    params['_id'] = mongoose.Types.ObjectId(params['_id']);
    let _id = params['_id'];

    usersModel.update({_id},{$set: params},(err,doc) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            res.json({ error_code: 0, result: {}});
        }
    });
});

//删除用户接口
router.post('/users/delete',(req,res) => {
    let _id = mongoose.Types.ObjectId(req.body['_id']);

    usersModel.remove({_id},(err,doc) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            res.json({ error_code: 0, result: {}});
        }
    });
});

/*========================================商品管理接口==========================================================*/
//获取所有商品接口
router.get('/goods/list',(req,res) => {

    //查询商品名称
    let searchVal = req.query.searchVal;
    let params = {product_name: new RegExp(searchVal)};

    //排序
    let sortField = req.query.sortField;
    let sort = req.query.sort;

    //分页
    let pageSize = Number(req.query.pageSize); //当前页
    let currentPage = Number(req.query.currentPage); //一页有多少条数据
    let skip = (currentPage-1) * pageSize; //跳过的数据数

    let goodsModelFind = goodsModel.find(params).skip(skip).limit(pageSize);

    if(sort !== undefined){
        switch(sortField){
            case 'product_name':
                if(sort === 'ascending'){goodsModelFind.sort({product_name: 1});}
                else {goodsModelFind.sort({product_name: -1});}
                break;
            case 'price':
                if(sort === 'ascending'){goodsModelFind.sort({price: 1});}
                else {goodsModelFind.sort({price: -1});}
                break;
            case 'popularity':
                if(sort === 'ascending'){goodsModelFind.sort({popularity: 1});}
                else {goodsModelFind.sort({popularity: -1});}
                break;
            case 'product_num':
                if(sort === 'ascending'){goodsModelFind.sort({product_num: 1});}
                else {goodsModelFind.sort({product_num: -1});}
                break;
            case 'grade':
                if(sort === 'ascending'){goodsModelFind.sort({grade: 1});}
                else {goodsModelFind.sort({grade: -1});}
                break;
            case 'volume':
                if(sort === 'ascending'){goodsModelFind.sort({volume: 1});}
                else {goodsModelFind.sort({volume: -1});}
                break;
            case 'classify':
                if(sort === 'ascending'){goodsModelFind.sort({classify: 1});}
                else {goodsModelFind.sort({classify: -1});}
                break;
            default:
                break;
        }
    }

    goodsModelFind.exec((err,goods) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            if(goods){
                goodsModel.count(params,(err1,total) => {
                    if(err1){
                        //服务器异常
                        base.serverError(err1);
                    }else{
                        if(total){
                            res.json({
                                error_code: 0,
                                data: {
                                    total,
                                    results: goods
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

//添加商品接口
router.post('/goods/create',(req,res) => {
    let params = req.body;

    goodsModel.find((err,goods) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            if(goods){
                //实例化对象，并插入数据
                let goodsInfo = new goodsModel(params);
                goodsInfo.save(params,(err1,goods1) => {
                    if(err1){
                        //服务器异常
                        base.serverError(err1);
                    }else{
                        if(goods1){
                            res.json({error_code: 0,data: {}});
                        }
                    }
                });
            }
        }
    });
});

//获取某个商品信息接口
router.get('/goods/info',(req,res) => {
    let _id = mongoose.Types.ObjectId(req.query['_id']); //把String类型的_id转化为ObjectId类型的_id

    goodsModel.findOne({_id},(err,good) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            if(good){
                res.json({ error_code: 0, data: good});
            }
        }
    });
});

//修改商品接口
router.post('/goods/update',(req,res) => {
    let params = req.body;
    params['_id'] = mongoose.Types.ObjectId(params['_id']);
    let _id = params['_id'];

    goodsModel.update({_id},{$set: params},(err,doc) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            res.json({ error_code: 0, data: {}});
        }
    });
});

//删除商品接口
router.post('/goods/delete',(req,res) => {
    let _id = mongoose.Types.ObjectId(req.body['_id']);

    goodsModel.remove({_id},(err,doc) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            res.json({ error_code: 0, data: {}});
        }
    });
});

module.exports = router;
