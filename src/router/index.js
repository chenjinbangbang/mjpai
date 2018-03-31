import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getNickName,getAdminName } from '@/utils/auth';

NProgress.configure({showSpinner: false});

/*import Home from '@/pages/Home';
import Main from '@/pages/Main';
import Goods from '@/pages/Goods';
import GoodsDetail from '@/pages/GoodsDetail';
import Collect from '@/pages/Collect';
import Contact from '@/pages/Contact';
import Integral from '@/pages/Integral';

//用户路由
import User from '@/pages/user/User';
import UserInfo from '@/pages/user/UserInfo';
import Info from '@/pages/user/Info';
import Secure from '@/pages/user/Secure';
import Address from '@/pages/user/Address';
import Cart from '@/pages/user/Cart';
import Order from '@/pages/user/Order';
import Generalize from '@/pages/user/generalize';

//管理员管理后台
import Admin from '@/pages/admin/Admin';
import Login from '@/pages/admin/Login';
import Main1 from '@/pages/admin/Main';
import UsersList from '@/pages/admin/UsersList';
import GoodsList from '@/pages/admin/GoodsList';*/

//使用webpack的require.ensure函数是一个代码分离的分割线，表示回调里面的require是我们想要进行分割出去的
//第一个参数[]，如['a.js','b.js']，那么b.js的加载依赖a.js的加载，所以涉及到同步加载，两个文件一起打包成同一个js文件
//import Home from '@/pages/Home';
const Home = r => require.ensure([],() => r(require('@/pages/Home')));
const Main = r => require.ensure([],() => r(require('@/pages/Main')));
const Goods = r => require.ensure([],() => r(require('@/pages/Goods')));
const GoodsDetail = r => require.ensure([],() => r(require('@/pages/GoodsDetail')));
const Collect = r => require.ensure([],() => r(require('@/pages/Collect')));
const Contact = r => require.ensure([],() => r(require('@/pages/Contact')));
const Integral = r => require.ensure([],() => r(require('@/pages/Integral')));

//用户路由
const User = r => require.ensure([],() => r(require('@/pages/user/User')));
const UserInfo = r => require.ensure([],() => r(require('@/pages/user/UserInfo')));
const Info = r => require.ensure([],() => r(require('@/pages/user/Info')));
const Secure = r => require.ensure([],() => r(require('@/pages/user/Secure')));
const Address = r => require.ensure([],() => r(require('@/pages/user/Address')));
const Cart = r => require.ensure([],() => r(require('@/pages/user/Cart')));
const Order = r => require.ensure([],() => r(require('@/pages/user/Order')));
const Generalize = r => require.ensure([],() => r(require('@/pages/user/Generalize')));

//管理员管理后台
const Admin = r => require.ensure([],() => r(require('@/pages/admin/Admin')));
const Login = r => require.ensure([],() => r(require('@/pages/admin/Login')));
const Main1 = r => require.ensure([],() => r(require('@/pages/admin/Main')));
const UsersList = r => require.ensure([],() => r(require('@/pages/admin/UsersList')));
const GoodsList = r => require.ensure([],() => r(require('@/pages/admin/GoodsList')));

Vue.use(Router);

let router = new Router({
    mode: 'history',
    //base: '/app/', //将要部署服务器文件夹路径
    routes: [
        { path: '/', component: Home, //meta: {homeauth: true},
            children: [
                { path: '', component: Main},
                { path: '/goods', component: Goods},
                { path: 'goodsdetail/:_id', name: 'goodsdetail', component: GoodsDetail},
                { path: 'collect', component: Collect},
                { path: 'contact', component: Contact},
                { path: 'integral', component: Integral},
                { path: 'user', component: User,
                    children: [
                        { path: 'userinfo', component: UserInfo},
                        { path: 'info', component: Info},
                        { path: 'secure', component: Secure},
                        { path: 'address', component: Address},
                        { path: 'cart', component: Cart},
                        { path: 'order', component: Order},
                        { path: 'generalize', component: Generalize},
                        //重定向userinfo
                        { path: '', redirect: 'userinfo'},
                        { path: '**', redirect: 'userinfo'},
                    ]
                },
            ]
        },
        { path: '/admin', component: Admin, //meta: {auth: true},
            children: [
                { path: 'login', component: Login,meta: {auth: true}},
                { path: '', component: Main1,
                    children: [
                        { path: '', component: UsersList},
                        { path: 'goodslist', component: GoodsList},
                        //重定向GoodsList
                        //{ path: '**', redirect: '/admin'},
                    ]
                },
                //重定向main1
                { path: '**', redirect: '/admin'},
            ]
        },
        { path: '**', redirect: '/'},
    ]
});

//const whiteList = ['/',/\/goodsdetail\/d+/,'/collect','/contact','/cart',/\/admin/]; //白名单

//验证是否登录，若没有登录则跳转到登录页
router.beforeEach((to,from,next) => { //to：Route即将要进入的目标，from：Route当前导航正要离开的路由，next：function
    NProgress.start();

    if(!/\/admin/.test(to.path)){
        if(getNickName()){
            next();
            NProgress.done();
        }else{
            if(!/\/user/.test(to.path)){ //在免登录白名单，直接进入
                next();
            }else{ //否则全部重定向到首页
                next('/');
                NProgress.done();
            }
        }
    }else{
        //console.log(/\/admin\/login/.test(to.path));
        if(getAdminName()){
            next();
            NProgress.done();
        }else{
            if(/\/admin\/login/.test(to.path)){ //在免登录白名单，直接进入
                next();
            }else{ //否则全部重定向到登录页
                next('/admin/login');
                NProgress.done();
            }
        }
    }

});

router.afterEach(() => {
   NProgress.done();
});

export default router;
