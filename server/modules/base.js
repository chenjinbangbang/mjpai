/*==========================================共用模块===============================================*/

//服务器异常
let serverError = (err,res) => {
    //服务器异常
    console.log(err.message);
    res.json({ error_code: 1, data: err.message});
};

//time为时间格式，返回2018-19-10 10:10:10的格式
let timeFormat = (time) => {
    time = new Date(time);
    let getFullYear = time.getFullYear(),
        getMonth = time.getMonth()+1 < 10 ? '0'+(time.getMonth()+1) : time.getMonth()+1,
        getDate = time.getDate() < 10 ? '0'+time.getDate() : time.getDate(),
        getHours = time.getHours() < 10 ? '0'+time.getHours() : time.getHours(),
        getMinutes = time.getMinutes() < 10 ? '0'+time.getMinutes() : time.getMinutes(),
        getSeconds = time.getSeconds() < 10 ? '0'+time.getSeconds() : time.getSeconds();
    return `${getFullYear}-${getMonth}-${getDate} ${getHours}:${getMinutes}:${getSeconds}`;
};

//time为时间格式，返回2018-19-10的格式
let timeFormat2 = (time) => {
    time = new Date(time);
    let getFullYear = time.getFullYear(),
        getMonth = time.getMonth()+1 < 10 ? '0'+(time.getMonth()+1) : time.getMonth()+1,
        getDate = time.getDate() < 10 ? '0'+time.getDate() : time.getDate();
    return `${getFullYear}-${getMonth}-${getDate}`;
};

//随机生成推广邀请码
let inviteCode = () => {
    let chars = [
        '0','1','2','3','4','5','6','7','8','9',
        'a','b','c','d','e','f','g','h','i','j',
        'k','l','m','n', 'o','p','q','r','s','t',
        'u','v','w','x','y','z'
    ];
    let res = "";
    for(let i=0;i<20;i++){
        let id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return res;
};

module.exports = {
    serverError,
    timeFormat,
    timeFormat2,
    inviteCode
};

