let qiniu = require("qiniu");

//在使用SDK之前，需要一对有效的AccessKey和SecretKey签名授权
qiniu.conf.ACCESS_KEY = "u4YPVaoYMTkutDmASk-xzcpi6Cu6qu1sXq-XFBr4";
qiniu.conf.SECRET_KEY = "o0tOR5WyyTG7CUSpxQPKEiNIp1-I6AXI_qTDCxei";

//要上传的空间
bucket = 'Bucket_Name';

//上传到七牛后保存的文件名
key = 'my-nodejs-logo.png';

//构建上传策略函数
function uptoken(bucket,key){
    let putPulicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPulicy.token();
}

//生成上传Token
token = uptoken(bucket,key);

//要上传文件的本地路径
filePath = './ruby-logo.png';

//构造上传函数
function uploadFile(uptoken,key,localFile){
    let extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken,key,localFile,extra,function(err,ret){
        if(!err){
            //上传成功，处理返回值
            console.log(ret.hash,ret.key,ret.persistentId);
        }else{
            //上传失败，处理返回代码
            console.log(err);
        }
    });
}

uploadFile(token,key,filePath);




