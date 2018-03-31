/*==========================================获取图形验证码===============================================*/
let svgCaptcha = require("svg-captcha");

//验证码
function getImgCode(req, res) {

    // 验证码，对了有两个属性，text是字符，data是svg代码
    let code = svgCaptcha.create({
        inverse: false, //翻转颜色
        fontSize: 58, //字体大小
        //color: true, //彩色
        //background: "#333", //背景颜色
        noise: 1, //噪声线条数
        width: 100, //宽度
        height: 40 //高度
    });

    // 保存到session,忽略大小写
    //req.session["randomcode"] = code.text.toLowerCase();
    // 保存到cookie,忽略大小写
    //res.cookie('imgCode',code.text.toLowerCase(),{path: '/',maxAge: 1000*60*60});

    // 返回数据直接放入页面元素展示即可
    res.send({error_code: 0,data: code});

}

module.exports = getImgCode;


