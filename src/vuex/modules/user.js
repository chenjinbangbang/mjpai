import { registerUser,loginByUsername,getUserInfo,getCartList } from '@/api/login';
import {
    getNickName,setNickName,removeStorage,
    getUsername,setUsername,
    getCartLength,setCartLength
} from '@/utils/auth';

const user = {
    state: {
        nickName: getNickName() || "", //昵称
        username: getUsername() || "", //用户名
        cartLength: getCartLength() || 0, //购物车数量
    },
    mutations: {
        //存储nickName
        set_nickName(state,msg){
            state.nickName = msg;
        },
        //存储username
        set_username(state,msg){
            state.username = msg;
        },
        //购物车数量
        set_cartLength(state,msg){
            state.cartLength = msg;
        },
    },
    actions: {
        //用户名注册
        registerUser({commit},data){
            return new Promise((resolve,reject) => {
                registerUser(data).then(res => {
                    if(res.error_code === 0){
                        commit('set_nickName',res.data.nickName);
                        setNickName(res.data.nickName);
                        commit('set_username',res.data.username);
                        setUsername(res.data.username);
                    }
                    resolve(res);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        //用户名登录
        LoginByUsername({commit},data){
            return new Promise((resolve,reject) => {
                loginByUsername(data).then(res => {
                    if(res.error_code === 0){
                        commit('set_nickName',res.data.nickName);
                        setNickName(res.data.nickName);
                        commit('set_username',res.data.username);
                        setUsername(res.data.username);
                    }
                    resolve(res);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        //退出登录
        LogOut({commit}){
            return new Promise((resolve,reject) => {
                commit('set_nickName','');
                commit('set_username','');
                commit('set_cartLength',0);
                removeStorage();
                resolve();
            });
        },
        //获取购物车列表
        getCartList({commit}){
            return new Promise((resolve,reject) => {
                getCartList().then(res => {
                    if(res.error_code === 0){
                        commit('set_cartLength',res.data.total);
                        setCartLength(res.data.total);
                    }
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        }
    }
};

export default user;
