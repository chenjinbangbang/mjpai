
import { passwordReg } from '@/api/users';

let rules = {

    //原密码验证
    passwordRule(rule,value,callback){
        let valReg = /^[\w-]{6,18}$/;
        if(value !== ''){
            if(!valReg.test(value)){
                callback(new Error('原密码必须为6-18位的字母/数字/_/-组成'));
            }else {
                //验证原密码是否正确
                passwordReg({password: value}).then(res => {
                    if(res.error_code === 0){
                        callback();
                    }else if(res.error_code === 3){
                        callback(new Error('原密码输入不正确'));
                    }
                });
            }
        }else{
            callback();
        }
    },

    //真实姓名验证
    nameRule(rule,value,callback) {
        let valReg = /[@#\$%\^&\*]+/g; //非法字符验证
        if(valReg.test(value)){
            callback(new Error('收货人姓名中含有非法字符'));
        }else if(value.length > 25){
            callback(new Error('收货人姓名中不能大于25位'));
        }else{
            callback();
        }
    },

    //详细地址验证
    streetRule(rule,value,callback){
        let valReg = /[@#\$%\^&\*]+/g; //非法字符验证
        if(valReg.test(value)){
            callback(new Error('收货人详细地址中含有非法字符'));
        }else if(value.length > 50){
            callback(new Error('收货人详细地址过长'));
        }else{
            callback();
        }
    },

    //手机号码验证
    phoneRule(rule,value,callback){
        let valReg = /^1[34578]\d{9}$/; //手机号码正则
        if(!valReg.test(value)){
            callback(new Error('手机号码格式有误'));
        }else{
            callback();
        }
    },

    //邮政编码验证
    post_codeRule(rule,value,callback){
        let valReg = /^[1-9][0-9]{5}$/; //邮政编码正则
        if(value !== ''){
            if(!valReg.test(value)){
                callback(new Error('邮政编码格式有误'));
            }
            callback();
        }
        callback();
    },

    //电子邮箱验证
    emailRule(rule,value,callback){
        let valReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; //电子邮箱正则
        if(value !== ''){
            if(!valReg.test(value)){
                callback(new Error('电子邮箱格式有误'));
                return;
            }
            callback();
        }
        callback();
    }
};

export default rules;






