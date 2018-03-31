import request from '@/utils/request';

//管理员登录接口
export function login(data){
    return request({
        url: '/admins/login',
        method: 'post',
        data
    });
}

//获取所有用户接口
export function getUsers(data){
    return request({
        url: '/admins/users/list',
        method: 'get',
        params: data
    });
}

//添加用户接口
export function createUser(data){
    return request({
        url: '/admins/users/create',
        method: 'post',
        data
    });
}

//获取某个用户信息接口
export function getUserInfo(data){
    return request({
        url: '/admins/users/info',
        method: 'get',
        params: data
    });
}

//修改用户接口
export function updateUser(data){
    return request({
        url: '/admins/users/update',
        method: 'post',
        data
    });
}

//获取所有商品列表接口
export function getGoodsList(data){
    return request({
        url: '/admins/goods/list',
        method: 'get',
        params: data
    });
}

//添加商品接口
export function createGoods(data){
    return request({
        url: '/admins/goods/create',
        method: 'post',
        data
    });
}

//获取某个商品信息接口
export function getGoodsInfo(data){
    return request({
        url: '/admins/goods/info',
        method: 'get',
        params: data
    });
}

//修改商品接口
export function updateGoods(data){
    return request({
        url: '/admins/goods/update',
        method: 'post',
        data
    });
}

//删除商品接口
export function deleteGoods(data){
    return request({
        url: '/admins/goods/delete',
        method: 'post',
        data
    });
}
