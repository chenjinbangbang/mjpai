// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

//引入axios
import axios from 'axios';
Vue.prototype.$http = axios;

//引入vuex
import Vuex from 'vuex';
import store from './vuex';
Vue.use(Vuex);

//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//引入ecahrts
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;
Vue.use(echarts);

//引入font-awesome
import 'font-awesome/css/font-awesome.min.css';

//引入全局css
import '@/assets/css/base.scss';

//quill样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//图片懒加载
import VueLazyLoad from 'vue-lazyload';
Vue.use(VueLazyLoad,{
    //preLoad: 2, //预加载高度的比例
    error: '', //请求失败后显示的图片
    loading: '/static/loading/loading-spokes.svg', //加载的loading过渡效果
    //try: 3, //加载图片的数量，默认1
    //attempt: 3, //尝试次数，默认3
});

//滚动加载数据
import infiniteScroll from 'vue-infinite-scroll';
Vue.use(infiniteScroll);

//图片剪切
/*import ImageClip from 'vue-image-clip';
Vue.use(ImageClip);*/

//引入富文本编辑器vue-quill-editor
/*import VueQuillEditor from 'vue-quill-editor';
Vue.use(VueQuillEditor);*/

//全局定义过滤器-保留小数点后两位
Vue.filter('toFix',(value) => {
    if(value > -1){ //确定val是否存在，否则toFixed就会报undefined的错
        return value.toFixed(2);
    }
});

//全局函数
import base from '@/utils/base';
Vue.use(base);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});
