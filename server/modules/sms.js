/*==============================================短信验证码功能模块================================================*/
//云通信基础能力业务短信发送，查询详情以及消费消息示例
const SMSClient = require('@alicloud/sms-sdk');
const accessKeyId = 'LTAIyJUY6O3qxcJr';
const secretAccessKey = 'NBqr8EtiTmTN3gRKuhl7zLwnTfogxC';
//初始化sms_client
let smsClient = new SMSClient({accessKeyId,secretAccessKey});

//发送手机验证码
function sms(req,res){

    //获取手机号码
    let phoneNumber = req.query.username;
    //随机获取6位数的验证码
    let code = "";
    for(let i=0;i<6;i++){
        code += Math.floor(Math.random() * 10);
    }

    smsClient.sendSMS({
        PhoneNumbers: phoneNumber,
        SignName: '我的唯一', //短信签名-签名名称
        TemplateCode: 'SMS_111895497', //短信模板ID-模板CODE
        TemplateParam: `{"code": ${code}}` //短信模板变量替换JSON串
    }).then(result => {
        console.log("发送手机验证码成功，验证码为："+code);
        let {Code} = result;
        if(Code === 'OK'){
            //处理返回参数
            console.log(result);
            res.json({
                error_code: 0,
                data: code
            });
        }else{
            res.json({
                error_code: 1,
                data: '获取验证码失败！'
            });
        }
    },(err) => {
        console.error("发送手机验证码失败：");
        console.error(err.code);

        if(err.code === 'isv.BUSINESS_LIMIT_CONTROL'){
            console.log("业务限流：使用同一个签名，对同一个手机号码发送短信验证码，支持1条/分钟，5条/小时，累计10条/天");
            res.json({
                error_code: 1,
                data: '手机验证码发送频繁，请稍后重新发送！'
            });
        }

    });

}

module.exports = sms;
