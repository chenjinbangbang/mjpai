let express = require('express');
let router = express.Router();
let formidable = require('formidable'); //用于解析表单数据的nodejs模块，特别是文件上传

let qiniu = require('qiniu');
//在使用SDK之前，需要一对有效的AccessKey和SecretKey签名授权
//qiniu.conf.ACCESS_KEY = "u4YPVaoYMTkutDmASk-xzcpi6Cu6qu1sXq-XFBr4";
//qiniu.conf.SECRET_KEY = "o0tOR5WyyTG7CUSpxQPKEiNIp1-I6AXI_qTDCxei";
let accessKey = "u4YPVaoYMTkutDmASk-xzcpi6Cu6qu1sXq-XFBr4";
let secretKey = "o0tOR5WyyTG7CUSpxQPKEiNIp1-I6AXI_qTDCxei";
let mac = new qiniu.auth.digest.Mac(accessKey,secretKey);
let options = {
    scope: "http://localhost:3100"
};


let base = require('../modules/base');
let mongoose = require("mongoose");

//获取图形验证码功能模块
let code = require('../modules/code');

//短信验证码功能模块
let sms = require('../modules/sms');

//hash算法加密
let hash = require('../modules/hash');

//调用mongodb数据库
let db = require('../models/mongodb');
let Users = require('../models/users');
let Goods = require('../models/goods');

//选择users和goods集合
let usersModel = db.model('users',Users);
let goodsModel = db.model('goods',Goods);

/*========================================每天积分收益==========================================================*/
function addInterval(){
    usersModel.find({},(err,users) => {
        if(err){
            //服务器异常
            console.log(err.message);
        }else{
            if(users){
                users.forEach(item => {
                    //每天收益积分 = 推广人数 * 会员等级 * 10%
                    usersModel.update({_id: item._id},{$inc: {integral: item.generalizeList.length * gradeFn(item.grade) * 0.01}},(err1,doc) => {
                        if(err1){
                            //服务器异常
                            console.log(err.message);
                        }else{

                        }
                    });

                    //今天距离上一次签到时间长度，若大于2，则连续签到次数sign_dats_num等于0
                    let time = (new Date().getTime() - new Date(item.sign_time).getTime())/(24*60*60*1000);
                    if(time >= 2){
                        usersModel.update({_id: item._id},{sign_days_num: 0},(err1,doc) => {
                            if(err1){
                                //服务器异常
                                console.log(err.message);
                            }else{

                            }
                        });
                    }

                });
            }
        }
    });
}
//setInterval(addInterval,1000*60*60*24);
setInterval(() => {
    let now = new Date();
    let hours = now.getHours();
    //判断时间是否为凌晨，如果是则执行
    if(hours === 0){
        addInterval();
    }
},1000);
//addInterval();
//等级分数对应的心数量
function gradeFn(grade){
    let grades = grade;
    if(grades >= 0 && grades < 5) return 0;
    if(grades >= 5 && grades <= 10) return 1;
    if(grades > 10 && grades <= 50) return 2;
    if(grades > 50 && grades <= 200) return 3;
    if(grades > 200 && grades <= 500) return 4;
    if(grades > 500 && grades <= 1000) return 5;
}

/*========================================登录注册功能==========================================================*/
//获取图形验证码接口
router.get("/code",code);

//短信定制服务
router.get("/phone_code",sms);

//文件上传
router.post('/upload',(req,res) => {
    //let file = req.body.file;
    //console.log(file.get('file'));

    let form = formidable.IncomingForm();
    //form.uploadDir = path.join(__dirname,'../../','public/img/upload'); //设置上传文件存放的文件夹，默认为系统的临时文件夹，可以使用fs.rename()来改变上传文件的存放位置和文件名
    form.keepExtensions = true; //设置该属性为true可以使得上传的文件保持原来的文件的扩展名
    form.parse(req,(err,fields,files) => { //该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
        if(err){
            console.log(err);
        }
        //console.log(fields);
        console.log(files);
        //console.log(files.mypic);

        //要上传的空间名
        let bucket = 'http://localhost:3100';

        //上传到七牛后保存的文件名
        let key = './tmp/' + Date.now() + '.jpg';

        //构建上传策略函数
        let putPolicy = new qiniu.rs.PutPolicy(options);
        let token = putPolicy.uploadToken(mac);
        console.log(token);

    });


    /*

    //要上传的空间名
    let bucket = 'http://localhost:3100';

    //上传到七牛后保存的文件名
    let key = 'my-nodejs-logo.png';

    //构建上传策略函数
    let putPolicy = new qiniu.rs.PutPolicy(bucket+':'+key);
    let token = putPolicy.token();

    //要上传文件的本地路径
    let filePath = './ruby-logo.png';

    //上传到七牛
    let extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(token,key,filePath,(err,ret) => {
        if(!err){
            console.log(ret);
        }else{
            console.log(err);
        }}
    );*/
});

//验证昵称是否存在接口
router.get('/nickName_exist',(req,res) => {
    let nickName = req.query.nickName;

    usersModel.findOne({nickName},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(!user){
                console.log("昵称未注册，可注册");
                res.json({ error_code: 0, data: {}});
            }else{
                console.log("昵称已存在");
                res.json({ error_code: 3, data: {}});
            }
        }
    });
});

//验证用户名是否存在接口
router.get('/username_exist',(req,res) => {
    let username = req.query.username;

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(!user){
                console.log("用户名未注册，可注册");
                res.json({ error_code: 0, result: {}});
            }else{
                console.log("用户名已存在");
                res.json({ error_code: 3, result: {}});
            }
        }
    });
});


//注册接口
router.post('/register',(req,res) => {
    let params = req.body;
    params.password = hash(params.password);

    //console.log(params);

    usersModel.findOne({$or: [{username: params.username},{nickName: params.nickName}]},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err);
        }else{
            if(!user){

                //实例化对象，并插入数据
                let user = new usersModel(params);
                user.save((err1,user1) => {
                    if(err1){
                        //服务器异常
                        base.serverError(err1,res);
                    }else{
                        console.log("注册成功："+user1.nickName);
                        res.json({ error_code: 0, data: { nickName: user1.nickName,username: user1.username}});

                        //判断uid是否存在，存在则是推广链接
                        if(params.uid){
                            let _id = mongoose.Types.ObjectId(params.uid);
                            usersModel.update({_id},{$addToSet: {generalizeList: user1._id}},(err2,doc) => {
                                if(err2){
                                    //服务器异常
                                    base.serverError(err2,res);
                                }else{
                                    console.log("上级推广成功！");
                                }
                            });
                        }

                    }
                });
            }
        }
    });
});

//登录接口
router.post('/login',(req,res) => {
    let params = req.body;
    params.password = hash(params.password);

    let last_login_time = new Date();

    //查询
    usersModel.findOne(params,(err,user) => { //doc：从mongodb数据库中返回回来的整个查询结果数据
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){
                //console.log("登录成功："+user.nickName);

                //更新最新的登录时间
                usersModel.update({nickName: user.nickName},{last_login_time},(err1,doc) => {
                    if(err1){
                        //服务器异常
                        base.serverError(err1,res);
                    }else{
                        res.json({
                            error_code: 0,
                            data: {
                                nickName: user.nickName,
                                username: user.username,
                            }
                        });
                    }
                });
            }else{
                res.json({ error_code: 1, data: '用户名或密码有误！!'});
            }
        }
    })
});

//获取用户信息接口-首页
router.get('/userinfo',(req,res) => {

    let username = req.headers.username;

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){

                //计算注册天数
                let register_days = new Date().getTime() - new Date(user.register_time).getTime(); //注册时间距离现在相差的毫秒数
                register_days = Math.floor(register_days/(1000*60*60*24));

                res.json({
                    error_code: 0,
                    data: {
                        nickName: user.nickName,
                        integral: user.integral,
                        account: user.account,
                        grade: user.grade,
                        register_time: base.timeFormat(user.register_time),
                        register_days: register_days,
                        sign_days_total: user.sign_days_total
                    }
                });
            }
        }
    });
});

/*========================================购物车页面==========================================================*/
//购物车列表接口
router.get('/cartlist',(req,res) => {
    let username = req.headers.username;

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){
                res.json({
                    error_code: 0,
                    data: {
                        total: user.cartList.length,
                        results: user.cartList
                    }
                });
            }
        }
    });
});

//加入购物车接口
router.post('/addCart',(req,res) => {
    let username = req.headers.username;

    let _id = mongoose.Types.ObjectId(req.body['_id']);
    let product_num = req.body.product_num;

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){
                //禁止购物车商品发生重复，购物车数量加1
                let goodsItem = '';
                user.cartList.forEach(item => {
                    //console.log(String(item['_id']) === String(_id));
                    if(String(item['_id']) === String(_id)){ //item['_id'] === _id：无法判断，需要使用String转化为字符串判断
                        goodsItem = item;
                        item.cart_num += product_num;
                    }
                });

                //判断商品是否存在于购物车
                if(goodsItem){ //商品存在于购物车，不可添加，购物车数量加1
                    user.save((err1,doc) => {
                        if(err1){
                            //服务器异常
                            base.serverError(err1,res);
                        }else{
                            res.json({ error_code: 0, data: {}});
                        }
                    });
                }else{ //商品不存在于购物车，可添加
                    goodsModel.findOne({_id},(err1,good) => {
                        if(err1){
                            //服务器异常
                            base.serverError(err1,res);
                        }else{
                            if(good){

                                //需要深度复制
                                let doc1 = JSON.stringify(good);
                                let doc2 = JSON.parse(doc1);

                                doc2.cart_num = 1;
                                user.cartList.push(doc2);
                                user.save((err2,doc) => {
                                    if(err2){
                                        //服务器异常
                                        base.serverError(err2,res);
                                    }else{
                                        res.json({ error_code: 0, data: {}});
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
});

//修改购物车商品的数量接口
router.post('/editCart',(req,res) => {
    let username = req.headers.username;

    let _id = mongoose.Types.ObjectId(req.body['_id']);
    let cart_num = req.body.cart_num;

    usersModel.update({username,"cartList._id": _id},{"cartList.$.cart_num": cart_num},(err,doc) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            res.json({ error_code: 0, data: {}});
        }
    });
});


//删除单个购物车商品接口
router.post('/deleteCart',(req,res) => {
    let username = req.headers.username;
    let _id = mongoose.Types.ObjectId(req.body['_id']);

    usersModel.update({username},{$pull: {cartList: {_id}}},(err,doc) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            res.json({ error_code: 0, data: {}});
        }
    });
});

//批量删除购物车商品接口
router.post('/deleteCartLists',(req,res) => {
    let username = req.headers.username;

    let arrId = req.body.arrId;
    arrId.forEach(item => {
        item['_id'] = mongoose.Types.ObjectId(item['_id']);
    });
    console.log(arrId);

    usersModel.update({username},{$pull: {cartList: {_id: {$in: arrId}}}},(err,doc) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            res.json({ error_code: 0, data: {}});
        }
    });
});


/*========================================用户信息==========================================================*/
//获取用户信息接口-账户信息
router.get('/info',(req,res) => {
    let username = req.headers.username;

    //获取本地ip地址
    let ip = "";
    if(req.connection.remoteAddress){
        ip = req.connection.remoteAddress;
    }

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){
                res.json({
                    error_code: 0,
                    data: {
                        last_login_time: base.timeFormat(user.last_login_time),
                        grade: user.grade,
                        integral: user.integral,
                        ip,
                        sign_days_num: user.sign_days_num,
                        get_integral: user.get_integral
                    }
                });
            }
        }
    });
});

//签到添加用户积分接口
router.post('/sign',(req,res) => {

    let username = req.headers.username;

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){

                let now = Date.parse(new Date().toLocaleDateString()), //今天签到的日期时间戳
                    sign_time = Date.parse(new Date(user.sign_time).toLocaleDateString()), //上一次签到的日期时间戳
                    sign_days_num = user.sign_days_num, //连续签到次数
                    sign_days_total = user.sign_days_total; //总共签到次数
                let inter = (now-sign_time)/(1000*60*60*24); //签到间隔次数
                console.log(inter);

                /*let get_integral = 1; //获得的积分
                sign_days_num++;
                switch(true){
                    case sign_days_num === 1: get_integral = 1; break;
                    case sign_days_num >= 2 && sign_days_num < 5: get_integral = 2; break;
                    case sign_days_num >= 5 && sign_days_num < 10: get_integral = 3; break;
                    case sign_days_num >= 10 && sign_days_num < 20: get_integral = 4; break;
                    case sign_days_num >= 20: get_integral = 5; break;
                    default: break;
                }
                usersModel.update({username},{$inc: {isign_days_total: 1,ntegral: get_integral,sign_days_num: 1},sign_time: new Date(),get_integral},(err1,doc) => {
                    if(err1){
                        //服务器异常
                        base.serverError(err1,res);
                    }else{
                        res.json({error_code: 0,data: {}});
                    }
                });*/

                let get_integral = 1; //获得的积分
                //判断是否刚注册，刚注册时sign_days_total为0，则按照“昨天没有签到记录”进行处理
                if(sign_days_total !== 0){
                    if(inter === 1){ //表示昨天有签到记录
                        sign_days_num++;
                        switch(true){
                            case sign_days_num === 1: get_integral = 1; break;
                            case sign_days_num >= 2 && sign_days_num < 5: get_integral = 2; break;
                            case sign_days_num >= 5 && sign_days_num < 10: get_integral = 3; break;
                            case sign_days_num >= 10 && sign_days_num < 20: get_integral = 4; break;
                            case sign_days_num >= 20: get_integral = 5; break;
                            default: break;
                        }
                        usersModel.update({username},{$inc: {sign_days_total: 1,integral: get_integral,sign_days_num: 1},sign_time: new Date(),get_integral},(err1,doc) => {
                            if(err1){
                                //服务器异常
                                base.serverError(err1,res);
                            }else{
                                res.json({error_code: 0,data: {}});
                            }
                        });
                    }else if(inter > 1){ //表示昨天没有签到记录
                        usersModel.update({username},{$inc: {sign_days_total: 1,integral: get_integral},sign_days_num: 1,sign_time: new Date(),get_integral},(err1,doc) => {
                            if(err1){
                                //服务器异常
                                base.serverError(err1,res);
                            }else{
                                res.json({error_code: 0,data: {}});
                            }
                        });
                    }else if(inter === 0){ //表示今天已经签到
                        res.json({error_code: 2,data: `您今天已经签到过！您已连续签到了 ${sign_days_num} 天`});
                    }
                }else{
                    usersModel.update({username},{$inc: {sign_days_total: 1,integral: get_integral},sign_days_num: 1,sign_time: new Date(),get_integral},(err1,doc) => {
                        if(err1){
                            //服务器异常
                            base.serverError(err1,res);
                        }else{
                            res.json({error_code: 0,data: {}});
                        }
                    });
                }

            }
        }
    });
});

//获取用户信息接口-个人信息
router.get('/info1',(req,res) => {
    let username = req.headers.username;

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){
                res.json({
                    error_code: 0,
                    data: {
                        portrait: user.portrait,
                        username: user.username,
                        nickName: user.nickName,
                        name: user.name,
                        sex: user.sex
                    }
                });
            }
        }
    });
});

//修改用户信息接口
router.post('/updateUser',(req,res) => {
    let username = req.headers.username;

    let params =  req.body;

    usersModel.update({username},params,(err,doc) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            res.json({ error_code: 0, data: {}});
        }
    });
});

//验证原密码接口
router.get('/passwordreg',(req,res) => {
    let username = req.headers.username;
    let password = hash(req.query.password);

    usersModel.findOne({username,password},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            //console.log(user);
            if(user){
                res.json({ error_code: 0, data: {}});
            }else{
                res.json({ error_code: 3, data: {}});
            }
        }
    });
});

//修改用户密码接口
router.post('/updatepwd',(req,res) => {
    let username = req.headers.username,
        password = hash(req.body.password);
    console.log(password);

    usersModel.update({username},{$set: {password}},(err,doc) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            res.json({ error_code: 0, data: {}});
        }
    });
});

/*========================================收货地址==========================================================*/
//获取收货地址列表接口
router.get('/address/list',(req,res) => {
    let username = req.headers.username;

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){
                res.json({ error_code: 0, data: user.addressList});
            }
        }
    });
});

//添加收货地址接口
router.post('/address/create',(req,res) => {
    let username = req.headers.username;
    //console.log(req.body);

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){
                let addressList = user.addressList; //获取用户的收货地址列表
                let address_id;
                //判断是否有地址列表信息
                if(addressList.length > 0){
                    address_id = addressList[addressList.length-1].address_id+1; //获取收货地址最后一个addressId，然后加一，实现addressId自增
                }else{
                    address_id = 10001;
                }

                //判断收货地址是否超过20个
                if(addressList.length < 20){
                    let params = req.body;
                    params.address_id = address_id;

                    //如果添加的收货地址是默认地址true，则其它收货地址设置为false
                    if(params.is_default === true){
                        addressList.forEach(item => {
                            item.is_default = false;
                        });
                        user.save((err1,user1) => {
                            if(err1){
                                //服务器异常
                                base.serverError(err1,res);
                            }else{
                                //res.json({ error_code: 0, result: {}});
                            }
                        });
                    }

                    usersModel.update({username},{$addToSet: {addressList: params}},(err1,doc) => {
                        if(err1){
                            //服务器异常
                            base.serverError(err1,res);
                        }else{
                            res.json({ error_code: 0, data: {isDefault: params.isDefault}});
                        }
                    });
                }else{
                    //收货地址不能超过20个
                    res.json({ error_code: 2, data: '收货地址不能超过20个'});
                }
            }
        }
    });
});

//设置默认地址接口
router.post('/address/set_default',(req,res) => {
    let username = req.headers.username;

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){
                let addressList = user.addressList;
                let address_id = req.body.address_id;

                addressList.forEach((item) => {
                    if(item.address_id === address_id){
                        item.is_default = true;
                    }else{
                        item.is_default = false;
                    }
                });
                user.save((err1,user1) => {
                    if(err1){
                        //服务器异常
                        base.serverError(err1,res);
                    }else{
                        res.json({ error_code: 0, result: {}});
                    }
                });
            }
        }
    });
});

//获取某个收货地址接口
router.get('/address/fetch',(req,res) => {
    let username = req.headers.username;
    let address_id = Number(req.query.address_id);

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){
                user.addressList.forEach((item) => {
                    if(item.address_id === address_id){
                        res.json({ error_code: 0, data: item});
                    }
                });
            }
        }
    });
});

//更新收货地址接口
router.post('/address/update',(req,res) => {
    let username = req.headers.username;

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){
                let params = req.body;
                let addressList = user.addressList;

                //如果添加的收货地址是默认地址true，则其它收货地址设置为false
                if(params.is_default === true){
                    addressList.forEach(item => {
                        item.is_default = false;
                    });
                    user.save((err1,user1) => {
                        if(err1){
                            //服务器异常
                            base.serverError(err1,res);
                        }else{
                            //res.json({ error_code: 0, result: {}});
                        }
                    });
                }

                usersModel.update({username,"addressList.address_id": params.address_id},{"addressList.$": params},(err1,doc) => {
                    if(err1){
                        //服务器异常
                        base.serverError(err1,res);
                    }else{
                        res.json({ error_code: 0, data: {}});
                    }
                });
            }
        }
    });
});

//删除收货地址
router.post('/address/delete',(req,res) => {
    let username = req.headers.username;
    let address_id = req.body.address_id;

    usersModel.update({username},{$pull: {addressList: {address_id}}},(err,doc) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            res.json({ error_code: 0, data: {}});
        }
    });
});

/*========================================我的推广==========================================================*/
//获取推广邀请码
router.get('/getInvite_code',(req,res) => {
    let username = req.headers.username;

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            res.json({error_code: 0,data: {invite_code: user._id}});
        }
    });
});

//获取推广记录
router.get('/generalizeList',(req,res) => {
    let username = req.headers.username;

    usersModel.findOne({username},(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            if(user){
                let generalize = user.generalizeList;
                //console.log(generalize);

                usersModel.find({_id: {$in: generalize}},(err1,users) => {
                    if(err1){
                        //服务器异常
                        base.serverError(err1,res);
                    }else{
                        let list = [];
                        users.forEach(item => {
                            list.push({
                                nickName: item.nickName,
                                username: item.username,
                                sex: item.sex,
                                register_time: base.timeFormat(item.register_time),
                                grade: item.grade
                            });
                        });

                        res.json({
                            error_code: 0,
                            data: {
                                total: users.length,
                                results: list
                            }
                        });
                    }
                });
            }
        }
    });
});

//获取推广记录的日期和对应推广人数
router.get('/generalizeData',(req,res) => {
    let username = req.headers.username;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    //console.log(startDate);

    usersModel.aggregate([{$project: {day: {$substr: ["$register_time",0,10]},username}},{$match: {day: {$gte: startDate,$lte: endDate}}},{$group: {_id: "$day",number: {$sum: 1}}}],(err,user) => {
        if(err){
            //服务器异常
            base.serverError(err,res);
        }else{
            let data = [];
            let date = (new Date(endDate).getTime()-new Date(startDate).getTime())/(24*60*60*1000); //筛选的天数

            let now;
            let setTime = (i) => { //处理日期函数
                now = new Date(endDate);
                return base.timeFormat2(now.setTime(now.getTime() - 24*60*60*1000*i));
            };

            //console.log(user);
            //处理数据
            for(let i=date;i>=0;i--){
                if(user.length > 0){
                    user.forEach(item => {
                        if(item._id === setTime(i)){
                            data.push({time: setTime(i),number: item.number});
                        }else{
                            data.push({time: setTime(i),number: 0});
                        }
                    });
                }else{
                    data.push({time: setTime(i),number: 0});
                }
            }
            //console.log(data);
            res.json({error_code: 0,data: data});
        }
    });
});


module.exports = router;
