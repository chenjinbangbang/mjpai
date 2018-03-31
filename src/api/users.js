import request from '@/utils/request';

//获取购物车列表接口
export function getCarts(){
    return request({
        url: '/users/cartList',
        method: 'get'
    });
}

//加入购物车接口
export function addCart(data){
    return request({
        url: '/users/addCart',
        method: 'post',
        data
    });
}

//修改购物车商品的数量接口
export function editCart(data){
    return request({
        url: '/users/editCart',
        method: 'post',
        data
    });
}

//删除单个购物车商品接口
export function deleteCart(data){
    return request({
        url: '/users/deleteCart',
        method: 'post',
        data
    });
}

//批量删除购物车商品接口
export function deleteCartLists(data){
    return request({
        url: '/users/deleteCartLists',
        method: 'post',
        data
    });
}

//获取用户信息接口-账户信息
export function getUserInfo(){
    return request({
        url: '/users/info',
        method: 'get'
    });
}

//获取/修改用户积分信息
export function updateUserIntegral(){
    return request({
        url: '/users/sign',
        method: 'post'
    });
}

//获取用户信息接口-个人信息
export function getUserInfo1(){
    return request({
        url: '/users/info1',
        method: 'get'
    });
}

//修改用户信息接口
export function updateUser(data){
    return request({
        url: '/users/updateUser',
        method: 'post',
        data
    });
}

//验证原密码
export function passwordReg(data){
    return request({
        url: '/users/passwordreg',
        method: 'get',
        params: data
    });
}

//修改用户密码
export function updatePwd(data){
    return request({
        url: '/users/updatepwd',
        method: 'post',
        data
    });
}

//获取收货地址列表接口
export function getAddressLists(){
    return request({
        url: '/users/address/list',
        method: 'get'
    });
}

//添加收货地址接口
export function createAddress(data){
    return request({
        url: '/users/address/create',
        method: 'post',
        data
    });
}

//修改当前收货地址为默认地址接口
export function setDefault(data){
    return request({
        url: '/users/address/set_default',
        method: 'post',
        data
    });
}

//获取当前收货地址为默认地址接口
export function fetchAddress(data){
    return request({
        url: '/users/address/fetch',
        method: 'get',
        params: data
    });
}

//更新收货地址接口
export function updateAddress(data){
    return request({
        url: '/users/address/update',
        method: 'post',
        data
    });
}

//删除收货地址接口
export function deleteAddress(data){
    return request({
        url: '/users/address/delete',
        method: 'post',
        data
    });
}


//获取推广邀请码
export function getInvite_code(){
    return request({
        url: '/users/getInvite_code',
        method: 'get'
    });
}

//获取推广记录
export function getGeneralizeList(){
    return request({
        url: '/users/generalizeList',
        method: 'get'
    });
}

//获取推广记录的日期和对应推广人数
export function getCharts(data){
    return request({
        url: '/users/generalizeData',
        method: 'get',
        params: data
    });
}
