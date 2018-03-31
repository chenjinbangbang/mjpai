<template>
    <div class='cart'>
        <div class="tabs">
            <ul>
                <li :class="{active: tabsChecked == index}" v-for="tab,index in tabs" @click="tabsClick(index)">
                    <span>{{tab}}</span>
                    <span v-if="index == 0">{{total}}</span>
                </li>
            </ul>
            <div class="tabsBorder" :style="tabsBorderStyle"></div>
        </div>

        <div class="tables">
            <el-table :data="cartList" stripe style="width: 100%;" tooltipEffect="dark" @selection-change="handleSelectionChange" v-loading="loading"s>
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="product_image" label="商品信息" width="300">
                    <template slot-scope="scope">
                        <div class="productDetail">
                            <div class="product_image">
                                <img v-lazy="scope.row.product_image[0]" alt="" />
                            </div>
                            <p>{{scope.row.product_name}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="商品单价">
                    <template slot-scope="scope">
                        <span>{{scope.row.price}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cart_num" label="数量" width="150">
                    <template slot-scope="scope">
                        <div @mouseover="getProductId(scope.row['_id'])">
                            <el-input-number v-model="scope.row.cart_num" :min="1" :max="scope.row.product_num" size="small" @change="editCart"></el-input-number>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="金额（￥）">
                    <template slot-scope="scope">
                        {{scope.row.price * scope.row.cart_num}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="info" size="small" @click="deleteCart(scope.row['_id'])">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="cartAccount" v-if="cartList.length > 0">
            <div class="cartDelete" @click="deleteCartLists">
                删除选中的商品
            </div>
            <div class="cartNumTotal">
                已选择 <span class="num">{{multipleSelection.length}}</span> 件商品
            </div>
            <div class="cartMoneyTotal">
                总价：<span class="money">￥{{cartMoneyTotal}}</span>
            </div>
            <div class="cartMoneyAccount" :class="{disabled: multipleSelection.length === 0}" @click="dopay">
                结算
            </div>
        </div>

    </div>
</template>

<style lang="scss">
    @import '../../assets/icon/iconfont.css';
    @import '../../assets/css/base';
    .cart{ text-align:center;
        .tabs{
            ul{ height:50px; font-size:16px; border-bottom:1px solid #ccc; display:flex; align-items:center; font-weight:bold;
                li{ width:100px; margin-right:20px; cursor:pointer;
                    &:hover{ color:$color;}
                    &.active{ color:$color;}
                }
            }
            .tabsBorder{ width:100px; height:1px; background-color:$color; transition:all 0.3s;}
        }
        .tables{
            .el-checkbox__inner{ border:1px solid #aaa;}
            .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{ background-color:$color; border:1px solid $color;}

            .productDetail{ display:flex;
                .product_image{ width:100px;
                    img{ width: 100%; cursor:pointer;}
                }
                p{ cursor:pointer; margin:5px;
                    &:hover{ color:#f00;}
                }
            }
        }
        .cartAccount{ height:40px; display:flex; justify-content:flex-end; align-items:center; font-size:14px;
            .cartDelete{ margin-right:auto; cursor:pointer; margin-left:60px;
                &:hover{ color:$color;}
            }
            .cartNumTotal{
                .num{ color:$color; font-weight:bold;}
            }
            .cartMoneyTotal{ margin:0 10px 0 40px;
                .money{ font-size:22px; color:$color; font-weight:bold;}
            }
            .cartMoneyAccount{ width:100px; height:40px; line-height:40px; font-size:16px; color:#fff; background-color:$color; cursor:pointer;
                &.disabled{ background-color:#aaa;}
                &:hover{ opacity:0.9;}
            }
        }
    }
</style>

<script>
    import { getCarts,editCart,deleteCart,deleteCartLists } from "@/api/users";
    export default {
        name: 'cart',
        components: {},
        data() {
            return {
                tabs: ['全部商品','降价商品'], //tabs列表
                tabsChecked: 0, //tabs默认选中索引
                tabsBorderStyle: { transform: 'translate(0,0)'}, //tabs底部线条默认位置
                cartList: [], //购物车列表
                loading: true, //加载数据
                _id: '', //获取当前选中的商品id：_id，修改购物车商品数量需要
                multipleSelection: [], //购物车选中列表数组
                total: null, //购物车总数
            }
        },
        mounted(){
            //获取购物车列表
            this.getCartList();
        },
        computed: {
            cartMoneyTotal(){ //总价
                let total = 0;
                for(let x of this.multipleSelection){
                    total += x.price * x.cart_num;
                }
                return total.toFixed(2);
            }
        },
        methods: {
            //选中tabs事件
            tabsClick(index){
                this.tabsChecked = index;
                this.tabsBorderStyle = { transform: 'translate('+ index*120 +'px,0)'}; //tabs底部线条位置变换
            },
            //获取购物车列表
            getCartList(){
                getCarts().then(res => {
                    if(res.error_code === 0){
                        this.cartList = res.data.results;
                        this.total = res.data.total;

                        this.$store.dispatch('getCartList',res.data.total);

                        this.loading = false;
                    }
                });
            },
            //当前选中列表
            handleSelectionChange(val){ //val：选中的全部购物车商品列表数组
                //console.log(val);
                this.multipleSelection = val;
            },
            //删除单个购物车商品
            deleteCart(_id){
                this.$confirm("确定要删除该宝贝吗？","删除宝贝",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteCart({_id}).then(res => {
                        if(res.error_code === 0){
                            this.$message.success({message: "删除成功！",center: true, duration: 1200});
                            //获取购物车列表
                            this.getCartList();
                        }
                    });
                }).catch(() => {});
            },
            //批量删除购物车商品
            deleteCartLists(){

                if(this.multipleSelection.length > 0){

                    let arrId = [];
                    this.multipleSelection.forEach(item => {
                        arrId.push(item['_id']);
                    });
                    //console.log(arrId);

                    this.$confirm("确定要批量删除这些宝贝吗？","删除宝贝",{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteCartLists({arrId}).then(res => {
                            if(res.error_code === 0){
                                this.$message.success({message: "批量删除成功！",center: true, duration: 1200});
                                //获取购物车列表
                                this.getCartList();
                            }
                        });
                    }).catch(() => {});
                }else{
                    this.$message.warning({message: "您没有选中商品！",center: true, duration: 1200});
                }


            },
            //获取当前选中的商品id：_id，修改购物车商品数量需要
            getProductId(_id){
                this._id = _id;
            },
            //修改购物车商品数量
            editCart(cart_num){
                editCart({_id: this._id,cart_num}).then(res => {

                });
            },
            //结算
            dopay(){
                if(this.multipleSelection.length > 0){
                    this.$router.push("/user/order");
                }
            }
        }
    }
</script>
