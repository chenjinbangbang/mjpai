<template>
    <div class="home">
        <header-component></header-component>
        <ul class="navbar">
            <li><router-link to="/" :class="{active: $route.path === '/'}">首页</router-link></li>
            <li><router-link to="/goods" :class="{active: $route.path === '/goods'}">全部商品</router-link></li>
            <li><router-link to="/contact" :class="{active: $route.path === '/contact'}">联系我们</router-link></li>
            <li><router-link to="/integral" :class="{active: $route.path === '/integral'}">赚取积分攻略</router-link></li>
            <li v-if="nickName"><router-link to="/user/userinfo" :class="{active: $route.path === '/user/userinfo'}">个人中心</router-link></li>
            <li v-if="nickName"><router-link to="/user/generalize" :class="{active: $route.path === '/user/generalize'}">我的推广</router-link></li>
        </ul>
        <div class="app-home">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
        <footer-component></footer-component>
    </div>
</template>

<style lang="scss">
    .home{
        //min-height:100%; position:relative; border:1px solid #f00;
        /*.el-menu{ height:40px; display:flex; justify-content:center; align-items: center;
            li{ display:flex; padding:0 40px; font-weight:bold;
                &:hover{ color:#ffd04b !important; background-color:#333 !important;}
            }
        }*/
        .navbar{ height:40px; display:flex; justify-content:center; align-items: center; background:linear-gradient(#ff3f0e, #da2e03); //background-color:#DA2E03;#FF3F0E
            li{; font-size:15px;
                a{ height:40px; line-height:40px; color:#fff; padding:0 20px; display:block;
                    &:hover,&.active{ background:linear-gradient(#ff3f0e, #ee7a23);
                        //background:linear-gradient(rgba(255,255,255,0.2), rgba(0,0,0,0.1));
                    }
                }
            }
        }
        .app-home{ width:1024px; margin:auto; //border:1px solid #f00;
            >div{ min-height:calc(100vh - 140px); padding-bottom:40px;} //calc表示整个浏览器窗口高度减去160px的大小
            /*@media(max-width: 1024px) { //为了兼s容IE浏览器分辨率
                width: 1024px;
            }*/
        }
    }
</style>

<script>
    import HeaderComponent from '@/pages/Header';
    import FooterComponent from '@/pages/Footer';
    import Cart from '@/components/Cart';
    export default {
        name: 'home',
        components: { HeaderComponent,FooterComponent,Cart },
        data() {
            return {
                activeIndex: this.$route.path, //导航默认索引
            };
        },
        computed: {
            //昵称实时更新
            nickName(){
                return this.$store.getters.nickName;
            }
        },
        methods: {
            handleSelect(key,keyPath){
                //console.log(key,keyPath);
            },
        }
    };
</script>
