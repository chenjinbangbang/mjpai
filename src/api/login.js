import request from '@/utils/request';

//验证昵称是否存在接口
export function nickNameReg(data){
    return request({
        url: '/users/nickName_exist',
        method: 'get',
        params: data
    });
}

//验证用户名是否存在接口
export function usernameReg(data){
    return request({
        url: '/users/username_exist',
        method: 'get',
        params: data
    });
}

//获取图形验证码接口
export function getCode(data){
    return request({
        url: '/users/code',
        method: 'get',
        params: data
    });
}

//获取手机验证码接口
export function getPhoneCode(data){
    return request({
        url: '/users/phone_code',
        method: 'get',
        params: data
    });
}

//注册接口
export function registerUser(data){
    return request({
        url: '/users/register',
        method: 'post',
        data
    });
}

//登录接口
export function loginByUsername(data){
    return request({
        url: '/users/login',
        method: 'post',
        data
    });
}

//获取用户信息接口
export function getUserInfo(){
    return request({
        url: '/users/userinfo',
        method: 'get'
    });
}

//获取购物车列表
export function getCartList(){
    return request({
        url: '/users/cartlist',
        method: 'get'
    });
}
