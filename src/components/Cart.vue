<template>
    <div class='cart'>
        <div class="cartIcon">
            <router-link to="/cart">
                <div class="num">{{cartLength}}</div>
                <!--<i class="el-icon-mobile-phone"></i>-->
                <i class="iconfont icon-cart"></i>
            </router-link>
        </div>
    </div>
</template>

<style lang="scss">
    /*.cart{
        .cartIcon{ width:50px; height:50px; line-height:50px; position:absolute; right:0; top:115px; cursor:pointer; text-align:center;
            a{ position:relative;
                .num{ width:18px; height:18px; line-height:18px; border-radius:50%; background-color:#f00; color:#fff; position:absolute; right:0; margin:5px;}
                i{ font-size:30px; margin:10px;}
            }
        }
    }*/
</style>

<script>
    export default {
        name: 'search',
        components: {},
        data() {
            return {

            };
        },
        computed: {
            //购物车列表数量实时更新
            cartLength: {
                get: function (){
                    return this.$store.state.cartLength;
                },
                set: function (newValue){
                    this.$store.state.cartLength = newValue;
                }
            }
        },
        mounted(){
            //获取购物车列表
            this.getCartList();
        },
        methods: {
            //获取购物车列表
            getCartList(){
                this.$http.get('/api/users/cartList').then((result) => {
                    let res = result.data;
                    if(res.status === '0'){
                        this.cartLength  = res.result.length;
                    }
                });
            },
        }
    };
</script>
