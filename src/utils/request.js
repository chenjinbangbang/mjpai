import axios from 'axios';
import { Message } from 'element-ui';
import store from '@/vuex';
import { getNickName,getUsername } from '@/utils/auth';

const service = axios.create({
    baseURL: process.env.BASE_API,
    //baseURL: "http://123.207.246.238:3100/api",
    //baseURL: "http://localhost:3100/api",
    withCredentials: true,
    timeout: 5000
});

service.interceptors.request.use(config => {
    //console.log(process.env.NODE_ENV);
    if(store.getters.username){
        config.headers['username'] = getUsername();
    }
    //console.log(config.headers);

    return config;
},error => {
    Promise.reject(error);
});

service.interceptors.response.use(response => {

    let res = response.data;

    if(res.error_code === 1){
        Message({ message: res.data, type: 'error',center:true, duration: 2000});
    }else if(res.error_code === 2){
        Message({ message: res.data, type: 'warning',center:true, duration: 2000});
    }

    return res;
},error => {
    Message({ message: error.message, type: 'error', duration: 2000,center:true});
    return Promise.reject(error);
});

export default service;
