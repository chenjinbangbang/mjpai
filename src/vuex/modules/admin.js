import { login } from '@/api/admin';
import { getAdminName,setAdminName } from '@/utils/auth';

const admin = {
    state: {
        adminName: getAdminName() || "", //管理员账号
    },
    mutations: {
        //存储adminName
        set_adminName(state,msg){
            state.adminName = msg;
        }
    },
    actions: {
        //管理员登录
        login({commit},data){
            return new Promise((resolve,reject) => {
                login(data).then(res => {
                    if(res.error_code === 0){
                        commit("set_adminName",res.data.adminName);
                        setAdminName(res.data.adminName);
                    }
                    resolve(res);
                }).catch(error => {
                    reject(error);
                });
            });
        }
    }
};

export default admin;
