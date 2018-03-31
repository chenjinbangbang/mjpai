<template>
    <div class="user">
        <div class="nav">
            <h2>热门功能</h2>
            <ul>
                <li><router-link to="/user/userinfo" exact>账户信息</router-link></li>
                <li><router-link to="/user/info">个人信息</router-link></li>
                <li><router-link to="/user/secure">修改密码</router-link></li>
                <li><router-link to="/user/address">收货地址</router-link></li>
                <li><router-link to="/user/cart">购物车</router-link></li>
                <li><router-link to="/user/generalize">我的推广</router-link></li>
            </ul>
        </div>
        <div class="content">
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<style lang="scss">
    @import '../../assets/css/base';
    .user{ display:flex; margin-top:20px;
        .nav{ flex:1;
            h2{ height:50px; line-height:50px;}
            ul{ font-size:14px;
                li{ height:30px; line-height:30px;

                    a{ color:#333;
                        //选中路由样式
                        &.router-link-active{ color:$color;}
                        &:hover{ color:$color; text-decoration:underline;}
                    }
                }
            }
        }
        .content{ flex:6;

        }
    }
</style>

<script>
    export default {
        name: 'user',
        components: {},
        data() {
            return {
                msg: 'user'
            };
        }
    };
</script>
