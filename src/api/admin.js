"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("@/utils/request");
//管理员登录接口
function login(data) {
    return request_1.default({
        url: '/admins/login',
        method: 'post',
        data: data
    });
}
exports.login = login;
//获取所有用户接口
function getUsers(data) {
    return request_1.default({
        url: '/admins/users/list',
        method: 'get',
        params: data
    });
}
exports.getUsers = getUsers;
//添加用户接口
function createUser(data) {
    return request_1.default({
        url: '/admins/users/create',
        method: 'post',
        data: data
    });
}
exports.createUser = createUser;
//获取某个用户信息接口
function getUserInfo(data) {
    return request_1.default({
        url: '/admins/users/info',
        method: 'get',
        params: data
    });
}
exports.getUserInfo = getUserInfo;
//修改用户接口
function updateUser(data) {
    return request_1.default({
        url: '/admins/users/update',
        method: 'post',
        data: data
    });
}
exports.updateUser = updateUser;
//获取所有商品列表接口
function getGoodsList(data) {
    return request_1.default({
        url: '/admins/goods/list',
        method: 'get',
        params: data
    });
}
exports.getGoodsList = getGoodsList;
//添加商品接口
function createGoods(data) {
    return request_1.default({
        url: '/admins/goods/create',
        method: 'post',
        data: data
    });
}
exports.createGoods = createGoods;
//获取某个商品信息接口
function getGoodsInfo(data) {
    return request_1.default({
        url: '/admins/goods/info',
        method: 'get',
        params: data
    });
}
exports.getGoodsInfo = getGoodsInfo;
//修改商品接口
function updateGoods(data) {
    return request_1.default({
        url: '/admins/goods/update',
        method: 'post',
        data: data
    });
}
exports.updateGoods = updateGoods;
//删除商品接口
function deleteGoods(data) {
    return request_1.default({
        url: '/admins/goods/delete',
        method: 'post',
        data: data
    });
}
exports.deleteGoods = deleteGoods;
