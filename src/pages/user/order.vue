<template>
    <div class="order">
        <div class="step">
            <el-steps :active="active" finishStatus="success" processStatus="finish" alignCenter>
                <el-step title="拍下商品"></el-step>
                <el-step title="付款"></el-step>
                <el-step title="确认收货"></el-step>
                <el-step title="评价"></el-step>
            </el-steps>
        </div>

        <div class="address">
            <h3>选择收货地址</h3>
            <ul>
                <li v-for="(address,index) in addressLists" :class="{active: addressIndex === index}" @click="addressChoose(index)">
                    <p>{{address.province}} {{address.city}} （{{address.name}}收）</p>
                    <p>{{address.province}}{{address.city}}{{address.area}}{{address.street}}</p>
                    <p>{{address.phone}}</p>
                    <el-tag class="is_default" type="danger" size="mini" v-if="address.is_default">默认地址</el-tag>
                </li>
            </ul>
            <div class="toAddress">
                <router-link to="/user/address" target="_blank">管理收货地址</router-link>
            </div>
        </div>

        <div class="order_confirm">
            <h3>选择收货地址</h3>
        </div>

    </div>
</template>

<style lang="scss">
    @import '../../assets/css/base';
    .order{
        .step{
            .el-steps{ width:600px; margin:20px auto 0 auto;
                .is-finish{ color:$color; border-color:$color;}
            }
        }
        h3{ margin-top:20px;}
        .address{
            h3{}
            ul{ display:flex; flex-wrap:wrap; justify-content:flex-start;
                li{ width:205px; height:100px; padding:8px; margin:10px 10px 0 0; border:2px dashed #ccc; font-size:12px; cursor:pointer; position:relative; border-radius:4px;
                    &:hover,&.active{ border-color:$color;}
                    p{ margin-bottom:8px;
                        &:nth-child(2){ height:30px; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp:2; overflow:hidden;}
                    }
                    .is_default{ position:absolute; top:0; right:0;}
                }
            }
            .toAddress{ height:40px; line-height:40px; //text-align:right;
                a{ color:$color;}
            }

        }
    }
</style>

<script>
    import { getAddressLists } from '@/api/users';
    export default {
        name: 'order',
        components: {},
        data() {
            return {
                active: 1, //步骤条的默认选中
                addressLists: [], //收货地址列表
                addressIndex: 0, //选中的地址
            };
        },
        created(){
            //获取收货地址列表
            this.getAddressLists();
        },
        methods: {
            //获取收货地址列表
            getAddressLists(){
                getAddressLists().then(res => {
                    if(res.error_code === 0){
                        this.addressLists = res.data;

                        //设置默认地址的选中
                        this.addressLists.forEach((item,index) => {
                            if(item.is_default === true){
                                this.addressIndex = index;
                            }
                        })

                    }
                });
            },
            //点击选择地址
            addressChoose(index){
                this.addressIndex = index;
            }
        }
    };
</script>
