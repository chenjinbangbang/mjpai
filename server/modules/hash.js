/*======================================Hash算法加密======================================*/
let crypto = require('crypto');
//console.log(crypto.getHashes()); //打印支持的hash算法

function hash(password){ //password是加密的明文
    let md5 = crypto.createHash('md5'); //定义加密方式：md5不可逆，此处的md5可以换成任意hash加密的方法名称
    md5.update(password);
    return md5.digest('hex'); //返回加密后的值
}

module.exports = hash;
