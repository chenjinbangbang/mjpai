<template>
    <div class="goodsdetail">

        <main class="main">
            <el-col :span="10" class="main-left" v-if="goodsDetail.product_image">
                <div id="magnifier">
                    <div class="small-box">
                        <img :src="goodsDetail.product_image[0]">
                        <span class="hover"></span>
                    </div>
                    <div class="thumbnail-box">
                        <a href="javascript:;" class="btn btn-prev"></a>
                        <a href="javascript:;" class="btn btn-next"></a>
                        <div class="list">
                            <ul class="wrapper">
                                <li v-for="img,index in goodsDetail.product_image" class="item"  :class="{'item-cur': index === 0}" :data-src="img"><img :src="img"></li>
                            </ul>
                        </div>
                    </div>
                    <div class="big-box">
                        <img :src="goodsDetail.product_image[0]"/>
                    </div>
                </div>

            </el-col>

            <el-col :span="14" class="main-right">
                <ul>
                    <li><h2>{{goodsDetail.product_name}}</h2></li>
                    <li><label>价 格：</label><span class="money">￥</span><span class="price">{{goodsDetail.price}}</span></li>
                    <li><label>库 存：</label><span class="red">{{goodsDetail.product_num}}</span>个</li>
                    <!--<li><label>付 款：</label>你拥有 <span class="red">333</span>积分，还需要付款<span class="red">2000</span>元现金才能购买</li>-->
                    <li><label>运 费：</label><span>包邮</span></li>
                    <li>
                        <label>评 分：</label>
                        <el-rate v-model="goodsDetail.grade" disabled showScore textColor="#ff9900" scoreTemplate="{value}"></el-rate>
                    </li>
                    <li v-for="attr in goodsDetail.attr" class="attr">
                        <label>{{attr.name}}：</label>
                        <ul v-if="attr.name === '颜色分类'" :class="{attr_color: attr.name === '颜色分类'}">
                            <li v-for="(value,index) in attr.value" :style="{'background-color': value}" :class="{active: attrColorIndex === index}" @click="attrColorIndex = index"></li>
                        </ul>
                        <ul v-else>
                            <li v-for="(value,index) in attr.value" :class="{active: attrOtherIndex === index}" @click="attrOtherIndex = index">{{value}}</li>
                        </ul>
                    </li>
                    <li>
                        <el-input-number v-model="product_num" :min="1" :max="goodsDetail.product_num"></el-input-number>
                        <el-button type="success">购买</el-button>
                        <el-button type="danger" @click="addCart(goodsDetail['_id'])">加入购物车</el-button>
                    </li>
                </ul>
            </el-col>
        </main>

        <div class="content">
            <div class="tabs">
                <ul>
                    <li :class="{active: tabsChecked == index}" v-for="tab,index in tabs" @click="tabsClick(index)">
                        <span>{{tab}}</span>
                    </li>
                </ul>
                <div class="tabsBorder" :style="tabsBorderStyle"></div>
            </div>

            <div class="detail" v-if="tabsChecked === 0" v-html="goodsDetail.detail">

            </div>

            <div class="comment" v-else>
                <ul>
                    <li v-for="item in goodsDetail.comment">
                        <div class="userDetail">
                            <div>
                                <p>{{item.nickName}}</p>
                                <grade :grade="item.grade"></grade>
                            </div>
                        </div>
                        <div class="commentDetail">
                            <p>{{item.content}}</p>
                        </div>
                        <div class="time">
                            <p>{{item.time}}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<style lang="scss">
    @import '../assets/css/base';
    .goodsdetail{ width:1024px; margin:30px auto;
        .main{
            .main-left{ border:1px solid #ddd;
                /*.imgView{
                    .imgBig{
                        img{width:100%; cursor:move;}
                    }
                    .imgSmall{
                        ul{ display:flex;
                            li{ width:15%; margin-left:4%; text-align:center; border:2px solid transparent;

                                &:hover,&.active{ border:2px solid #f00;}
                                img{ width:50px;}
                            }
                        }
                    }
                }*/

                #magnifier { position: relative; width: 100%;}
                .small-box { width:425px; height:425px; display:flex; align-items:center; justify-content:center; position: relative; margin-bottom: 20px; border: 1px solid #ccc;}
                .small-box img { display: block; max-width: 100%; max-height:100%;}
                .small-box .hover { display: none; position: absolute; left: 0; top: 0; width: 200px; height: 200px; border: 1px solid #aaa;
                    background: #0099ff; opacity: .5; cursor: move;
                    //filter: alpha(opacity: 50);
                }
                .thumbnail-box { position: relative; width: 100%;}
                .thumbnail-box .btn { position: absolute; top: 50%; width: 22px; height: 32px; margin-top: -16px;}
                .thumbnail-box .btn-prev { left: 0; background: url(../../static/images/btn_prev.png) no-repeat; }
                .thumbnail-box .btn-next { right: 0; background: url(../../static/images/btn_next.png) no-repeat; }
                .thumbnail-box .list { overflow: hidden; width: 390px; margin: 0 auto;}
                .thumbnail-box .wrapper { width: 100000px;}
                .thumbnail-box .list .item { float: left; margin: 0 10px; cursor:pointer;}
                .thumbnail-box .list .item-cur {}
                .thumbnail-box .list .item img { width:56px; border: 2px solid #fff;}
                .thumbnail-box .list .item-cur img { border: 2px solid #e53e41;}
                .big-box { display: none; overflow: hidden; position: absolute; z-index:10; left: 451px; top: 0; width: 540px; height: 540px; border: 1px solid #e4e4e4;}
                .big-box img { display: block;}
            }
            .main-right{ text-align:left; padding-left:50px;
                >ul{ font-size:14px;
                    >li{ margin-bottom:20px;
                        h2{}
                        .money{ font-size:18px; color:#f00;}
                        .price{ font-size:30px; color:#f00;}
                        .el-rate{ display:inline-block;}
                        &.attr{
                            ul{ display:inline-block;
                                li{ margin-right:5px; display:inline-block; cursor:pointer; border:2px solid #ccc; padding:5px 8px;
                                    &.active{ border-color:#f00;}
                                }
                                &.attr_color{
                                    li{ width:25px; height:25px;}
                                }
                            }

                        }
                    }
                }
            }
        }
        .content{ clear:both; padding-top:20px;
            .tabs{ text-align:center; margin-bottom:20px;
                ul{ height:50px; font-size:16px; border-bottom:1px solid #ccc; display:flex; align-items:center; font-weight:bold;
                    li{ width:100px; margin-right:20px; cursor:pointer;
                        &:hover{ color:$color;}
                        &.active{ color:$color;}
                    }
                }
                .tabsBorder{ width:100px; height:2px; background-color:$color; transition:all 0.3s;}
            }
            .detail{
                img{ width:100%;}
            }
            .comment{
                ul{
                    li{ display:flex; padding:10px 0; border-bottom:1px solid #ccc;
                        .userDetail{ width:120px; text-align:right; display:flex; align-items:center; justify-content:flex-end;
                            p{}
                        }
                        .commentDetail{ flex: 1; padding:20px 40px;}
                        .time{ color:#666; display:flex; align-items:flex-end;}
                    }
                }
            }
        }
    }
</style>

<script>
    import $ from 'jquery';
    import magnifier from '../assets/js/magnifier';
    import { getCarts,addCart } from '@/api/users';
    import { getGoodsDetail } from '@/api/goods';
    import Grade from '@/components/grade';
    export default {
        name: 'goodsdetail',
        components: {Grade},
        data() {
            return {
                goodsDetail: {}, //商品信息
                product_num: 1, //选择商品数量
                attrColorIndex: 0, //颜色分类默认选中
                attrOtherIndex: 0, //其他属性默认选中
                tabs: ['商品详情','商品评价'], //tabs列表
                tabsChecked: 0, //tabs默认选中索引
                tabsBorderStyle: { transform: 'translate(0,0)'}, //tabs底部线条默认位置
            };
        },
        created(){
            //获取商品信息
            this.getGoodsDetail();
        },
        methods: {
            //获取商品信息
            getGoodsDetail(){
                let _id = this.$route.params['_id'];
                getGoodsDetail({_id}).then(res => {
                    if(res.error_code === 0){
                        this.goodsDetail = res.data;

                        //商品扩大预览jquery插件
                        $(function () {
                            $('#magnifier').magnifier();
                        });
                    }
                })
            },
            //加入购物车
            addCart(_id){
                addCart({_id,product_num: this.product_num}).then(res => {
                    if(res.error_code === 0){
                        this.$message.success({message: "加入购物车成功！",center: true, duration: 1200});
                        //获取购物车列表长度
                        this.getCartList();
                    }
                });
            },
            //获取购物车列表数量
            getCartList(){
                getCarts().then(res => {
                    if(res.error_code === 0){
                        this.$store.dispatch('getCartList',res.data.total);
                    }
                });
            },
            //选中tabs事件
            tabsClick(index){
                this.tabsChecked = index;
                this.tabsBorderStyle = { transform: 'translate('+ index*120 +'px,0)'}; //tabs底部线条位置变换
            },
        }
    };
</script>
