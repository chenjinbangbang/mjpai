<template>
    <div class='goods'>
        <div class="search">
            <el-input placeholder="输入商品名称...." v-model="searchVal" @keyup.enter.native="searchClick">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchClick"></i>
            </el-input>
        </div>

        <div class="goods">

            <div class="filter">
                <div class="classify">
                    <ul>
                        <li v-for="(item,index) in classify" :class="{active: classifyChecked == index}" @click="setClassify(index)">{{item}}</li>
                    </ul>
                </div>

                <div class="price">
                    <label class="title">价格：</label>
                    <ul>
                        <li @click="setPriceFilter('all')" :class="{active: priceChecked == 'all'}">全部</li>
                        <li v-for="price,index in priceFilter" @click="setPriceFilter(index)" :class="{active: priceChecked == index}">{{price}}</li>
                        <li>
                            <input type="number" v-model.number="priceInterval.startPrice"/> - <input type="number" v-model.number="priceInterval.endPrice"/> <button type="button" @click="setPriceFilter('interval')">确定</button>
                        </li>
                    </ul>
                </div>

                <div class="sort">
                    <ul>
                        <li v-for="sort,index in sortList" :class="{active: sortChecked == index}" @click="setSort(index)">
                            <span>{{sort}}</span>
                            <div class="priceFilter" v-show="sortChecked == 3 && sort == '价格'">
                                <i class="el-icon-caret-top" :class="{black: sortFlag == 1}"></i>
                                <i class="el-icon-caret-bottom" :class="{black: sortFlag == -1}"></i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="goodsList">
                <div v-for="goods in goodsList">
                    <el-col :span="6">
                        <div class="good">
                            <router-link :to="{name: 'goodsdetail',params: {_id: goods['_id']}}">
                                <div class="goodImg">
                                    <img v-lazy="goods.product_image[0]" alt="" />
                                </div>
                                <div class="detail">
                                    <div class="integral-salesVolume">
                                        <h2 class="integral"><span>￥</span>{{goods.price}}</h2>
                                        <p class="salesVolume">已卖出<span class="red">{{goods.volume > 0 ? goods.volume : 0}}</span>件</p>
                                    </div>
                                    <div class="name">{{goods.product_name}}</div>
                                    <div class="cart_num">
                                        <p><i class="fa fa-heart-o fa-lg"></i><span>{{goods.cart_num}}</span></p>
                                        <p><i class="fa fa-commenting-o fa-lg"></i><span>{{goods.comment.length}}</span></p>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </el-col>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>

        <div class="page">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[4,8,20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<style lang="scss">
    @import '../assets/css/base';
    .goods{
        .search{ height:80px; line-height:80px; background-color:#eee; text-align:center; position:absolute; width:100%; left:0;
            .el-input{ width:500px;
                i{ cursor:pointer;}
            }
        }
        .goods{ padding-top:80px;
            .filter{
                ul{ height:40px; display:flex; align-items:center;
                    li{ padding:0 12px; cursor:pointer; height:40px; line-height:40px;
                        &:hover{ color:$color;}
                    }
                }
                .classify{
                    ul{ justify-content:center;
                        li{
                            &.active{ color:$color; border-bottom:2px solid $color;}
                        }
                    }
                }
                .price{ margin-top:20px; display:flex; align-items:center; //border:1px solid #f00;
                    .title{ width:80px;}
                    ul{
                        li{
                            &.active{ color:$color;}
                            input{ width:60px;}
                        }
                    }
                }
                .sort{ margin-top:10px;
                    ul{ height:30px; justify-content:center; border-top:1px solid #ddd;
                        li{ height:30px; line-height:30px; display:flex;
                            &:last-child{ width:80px;}
                            &.active{ color:#fff; background-color:$color;}
                            .priceFilter{ margin:7px 0 0 5px;
                                i{ display:block; height:8px; line-height:8px; width:100%;}
                            }
                        }
                    }
                }
            }

            .goodsList{
                .good{ width:95%; margin:20px auto 0 auto; border:1px solid #eee; transition: all 1s;
                    &:hover{ border:1px solid $color;}
                    .goodImg{ cursor:pointer;position:relative; overflow:hidden;
                        img{ width:100%; transition: all 0.5s;
                            &:hover{ transform:scale(1.05);}
                        }
                    }
                    a{ color:#333;
                        .detail{ padding:0 15px 10px 15px;
                            .integral-salesVolume{ height:30px; margin:10px 0; display:flex; align-items:center; justify-content: space-between;
                                .integral{ text-align:left; color:#f00; font-weight:normal;
                                    span{ font-size:14px;}
                                }
                                .salesVolume{ text-align:right;}
                            }
                            .name{ height:20px; text-align:left; cursor:pointer;
                                &:hover{ color:#f00;}
                            }
                            .cart_num{ height:30px; display:flex; align-items:center;
                                p{ margin-right:12px; display:flex;
                                    &:nth-child(1){
                                        i{ margin-top:3px;}
                                    }
                                    i{ color:#f00;}
                                    span{ margin-left:6px;}
                                }
                            }
                        }
                    }
                }
                .load-more{ height: 100px; line-height:100px; text-align:center;}
            }
        }
        .page{ text-align:right; margin-top:20px;}
    }
</style>

<script>
    import { getGoods } from '@/api/goods';
    export default {
        name: 'goods',
        components: {},
        data () {
            return {
                searchVal: '', //搜索关键字
                classify: ['全部','男女服饰','化妆品','居家生活','美食特产','数码电器','母婴童装','鞋包配饰','文体户外','电子产品'], //商品分类
                classifyChecked: 0, //商品分类索引
                goodsList: [], //商品列表数据
                priceFilter: ['0-50','50-100','100-500','500-1000','1000以上'],//价格区间筛选
                priceInterval: {startPrice: '',endPrice: ''}, //输入价格区间筛选
                priceChecked: 'all', //默认选中价格区间的值
                sortFlag: 0, //默认降序排序,-1为价格降序，0为综合，1为价格降序，2为人气降序，3为销量降序
                sortList: ['综合','人气','销量','价格'], //排序方式
                sortChecked: 0,
                currentPage: 1, //当前页
                pageSize: 8, //每页有多少条数据
                total: 0, //总页数
                //busy: true, //是否禁止滚动加载数据
                //loading: false, //加载条的显示与隐藏
            }
        },
        created(){
            //获取商品列表
            this.getGoodsList();
        },
        methods: {
            // 搜索关键字
            searchClick(){
                this.currentPage = 1;
                //获取商品列表
                this.getGoodsList();
            },
            getGoodsList(){
                let params = {
                    searchVal: this.searchVal,
                    classify: this.classify[this.classifyChecked],
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    sort: this.sortFlag,
                    priceLevel: this.priceChecked,
                    priceInterval: this.priceInterval
                };
                //this.loading = true;
                getGoods(params).then(res => {
                    //this.loading = false;
                    if(res.error_code === 0){
                        this.goodsList = res.data.results;
                        this.total = res.data.total;
                    }
                });
            },
            //每页多少条数据
            handleSizeChange(val) {
                this.pageSize = val;
                this.tableListsChange();
            },
            //当前页
            handleCurrentChange(val){
                this.currentPage = val;
                this.tableListsChange();
            },
            //获取当前分页表格数据
            tableListsChange(){
                this.getGoodsList();
            },
            //商品分类
            setClassify(index){
                this.classifyChecked = index;
                this.getGoodsList();
            },
            //价格区间筛选
            setPriceFilter(index){
                this.priceChecked = index;
                if(index === 'interval'){
                    //判断区间筛选输入是否正确，不正确就默认筛选全部
                    if(this.priceInterval.startPrice === '' || this.priceInterval.startPrice === '' || this.priceInterval.startPrice >  this.priceInterval.endPrice){
                        this.priceChecked = 'all';
                    }
                }
                this.currentPage = 1;
                this.getGoodsList();
            },
            //综合，人气降序，销量降序，价格升序和降序
            setSort(index){
                this.sortChecked = index;

                switch(index){
                    case 0: this.sortFlag = 0; break; //综合
                    case 1: this.sortFlag = 2; break; //人气降序
                    case 2: this.sortFlag = 3; break; //销量降序
                    case 3: //价格排序：升序和降序切换
                        if(this.sortFlag !== 1){
                            this.sortFlag = -1;
                        }
                        if(this.sortFlag === 1){
                            this.sortFlag = -1;
                        }else{
                            this.sortFlag = 1;
                        }
                        break;
                    default:
                        break;
                }
                this.currentPage = 1;
                this.getGoodsList();
            }
        }
    }
</script>
