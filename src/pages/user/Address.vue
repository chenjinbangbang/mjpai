<template>
    <div class="addressPage">
        <div class="top">
            <h2>收货地址</h2>
        </div>

        <div class="addressadd">
            <el-button type="primary" size="small" plain @click="addAddress">新增收货地址</el-button>
            <p>您已创建 <span class="themeColor">{{addressLists.length}}</span> 个收货地址，最多可创建 <span class="themeColor">20</span> 个</p>
        </div>

        <div class="addressLists">
            <div class="noAddress" v-if="addressLists.length === 0">暂无收货地址！！</div>
            <ul v-else>
                <li v-for="address,index in addressLists">
                    <div class="title">
                        <h3>{{address.name}} {{address.province}} {{address.address_id}}</h3>
                        <el-tag type="danger" size="small" v-if="address.is_default">默认地址</el-tag>
                    </div>
                    <div class="delete" @click="deleteAddress(address.address_id)">
                        <i class="el-icon-delete"></i>
                    </div>
                    <div class="operate">
                        <el-button size="mini" @click="setDefault(address.address_id)" v-if="!address.is_default">设为默认</el-button>
                        <i class="el-icon-edit-outline" @click="editAddress(address.address_id)"></i>
                    </div>
                    <ul>
                        <li><label>收货人：</label><p>{{address.name}}</p></li>
                        <li><label>所在地区：</label><p>{{address.province}}{{address.city}}{{address.area}}</p></li>
                        <li><label>地址：</label><p>{{address.street}}</p></li>
                        <li><label>手机：</label><p>{{address.phone}}</p></li>
                        <li><label>邮编：</label><p>{{address.post_code}}</p></li>
                        <li><label>电子邮箱：</label><p>{{address.email}}</p></li>
                    </ul>
                </li>
            </ul>
        </div>

        <div v-if="visible">
            <el-dialog :title="dialogTitle == 0 ? '新增收货地址' : '编辑收货地址'" :visible.sync="visible" :beforeClose="handleClose"  center :closeOnClickModal="false">
                <el-dialog :visible.sync="innerVisible" appendToBody>
                    <p class="errorAlert" style="text-align:center; color:#f00;">
                        <i class="el-icon-error"></i>
                        <span>收货地址信息输入有误！</span>
                    </p>
                    <div slot="footer">
                        <el-button type="default" @click="innerVisible = false">返 回</el-button>
                    </div>
                </el-dialog>

                <el-form :model="address" ref="address" labelWidth="100px" :rules="rules">
                    <el-form-item label="收货人" prop="name">
                        <el-input v-model="address.name" autoComplete="off" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="所在地区" prop="region">
                        <el-cascader :options="regionOptions" v-model="address.region" @change="addressChange"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="street">
                        <el-input v-model="address.street" autoComplete="off" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="address.phone" autoComplete="off" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="邮政编码" prop="post_code">
                        <el-input v-model="address.post_code" autoComplete="off" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="email">
                        <el-input v-model="address.email" autoComplete="off" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="设为默认地址" prop="is_default">
                        <el-switch v-model="address.is_default" activeColor="#ee7a23" inactiveColor="#bbb"></el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="changeAddress">保存收货地址</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>

    </div>
</template>

<style lang="scss">
    @import '../../assets/css/base';
    .addressPage{
        .addressadd{ display:flex; align-items:center; //margin:5px;
            p{ margin-left:20px;}
        }
        .addressLists{
            .noAddress{ text-align:center; color:#666; font-size:14px; margin-top:30px;}
            h2{}
            >ul{ display:flex; flex-wrap:wrap; justify-content:space-between;
                >li{ width:48%; padding:10px; border:2px solid #ddd; position:relative; margin-top:20px; cursor:pointer; transition:all 0.5s; background-color:#fff;
                    &:hover{ border:2px solid $color; transform:scale(1.02);}
                    .title{ height:30px;display:flex; align-items:center;
                        h3{ text-align:left; border-bottom:1px solid #eee; margin-right:10px; font-weight:normal;}
                    }
                    i{ margin-left:10px;
                        &:hover{ color:$color;}
                    }
                    .delete{ position:absolute; top:0; right:0; margin:10px 15px; font-size:18px;
                        i{
                            &:hover{}
                        }
                    }
                    .operate{ position:absolute; right:0; bottom:0; margin:10px 15px; display:flex; align-items:center; font-size:18px;
                        i{
                            &:hover{}
                        }
                    }

                    ul{ font-size:12px;
                        li{ display:flex; height:25px; line-height:25px;
                            label{ width:100px; text-align:right;}
                        }
                    }
                }
            }
        }
    }

</style>

<script>
    //import Area from '../../../static/area.json'; //获取中国省市区三级联json格式
    import { getAddressLists,createAddress,setDefault,fetchAddress,updateAddress,deleteAddress } from '@/api/users';
    import rules from '@/utils/validate';
    import { getArea } from '@/utils';
    export default {
        name: 'addressPage',
        components: {},
        data() {
            return {
                addressLists: [], //收货地址列表
                //address: {userName: '', region: [], street: '', phoneNumber: '',postCode: '', email: '', isDefault: false}, //收货地址表单
                address: {address_id: null,name: '陈进帮', region: ['北京','北京','东城区'], street: '西乡街道', phone: '13570648982',post_code: '', email: '', is_default: false}, //收货地址表单
                visible: false, //新增或编辑弹出框的显示与隐藏
                dialogTitle: 0, //判断用户是新增还是编辑收货地址,0为新增，1为编辑
                innerVisible: false, //新增或编辑弹出框的提示框的显示与隐藏
                regionOptions: [], //中国省市区三级联级联选择器
                //验证表单规则
                rules: {
                    name: [
                        {required: true, message: '收货人姓名不能为空'},
                        {validator: rules.nameRule, trigger: 'blur'}
                    ],
                    region: [
                        {required: true, message: '收货人所在地区不能为空'}
                    ],
                    street: [
                        {required: true, message: '收货人详细地址不能为空'},
                        {validator:  rules.streetRule, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '收货人手机号码不能为空'},
                        {validator: rules.phoneRule, trigger: 'blur'}
                    ],
                    post_code: [
                        {validator: rules.post_codeRule, trigger: 'blur'}
                    ],
                    email: [
                        {validator: rules.emailRule, trigger: 'blur'}
                    ]
                }
            };
        },
        created(){
            //获取收货地址列表
            this.getAddressLists();

            //获取中国省市区三级联级联选择器
            this.regionOptions = getArea();
        },
        methods: {
            //三级联地址改变
            addressChange(value){
                this.address.region = value;
            },
            //获取收货地址列表
            getAddressLists(){
                getAddressLists().then(res => {
                    if(res.error_code === 0){
                        this.addressLists = res.data;
                    }
                });
            },
            //修改当前地址设为默认地址
            setDefault(address_id){
                setDefault({address_id}).then(res => {
                    if(res.error_code === 0){
                        //获取收货地址列表
                        this.getAddressLists();
                    }
                });
            },
            //点击新增收货地址
            addAddress(){
                this.visible = true;
                this.dialogTitle = 0;
            },
            //点击编辑收货地址
            editAddress(address_id){
                this.visible = true;
                this.dialogTitle = 1;

                fetchAddress({address_id}).then(res => {
                    if(res.error_code === 0){
                        //获取收货地址列表
                        let addressList = res.data;
                        this.address = {
                            address_id: addressList.address_id,
                            name: addressList.name,
                            region: [addressList.province,addressList.city,addressList.area],
                            street: addressList.street,
                            phone: addressList.phone,
                            post_code: addressList.post_code,
                            email: addressList.email,
                            is_default: addressList.is_default
                        }; //收货地址表单
                    }
                });
            },
            //添加或编辑收货地址
            changeAddress(){
                this.$refs['address'].validate((valid) => {
                    if(valid){
                        //判断用户是新增还是编辑收货地址,0为新增，1为编辑
                        if(this.dialogTitle === 0){
                            let params = {
                                name: this.address.name,
                                province: this.address.region[0],
                                city: this.address.region[1],
                                area: this.address.region[2],
                                street: this.address.street,
                                phone: this.address.phone,
                                post_code: this.address.post_code,
                                email: this.address.email,
                                is_default: this.address.is_default,
                            };
                            //新增收货地址
                            createAddress(params).then(res => {
                                if(res.error_code === 0){
                                    //判断添加的收货地址是否为默认地址，设置默认地址唯一
                                    if(res.data.is_default === true){
                                        this.setDefault(res.data.is_default);
                                    }else{
                                        //获取收货地址列表
                                        this.getAddressLists();
                                    }
                                    //关闭新增编辑框，并进行表单重置
                                    this.handleClose();
                                }
                            });
                        }else if(this.dialogTitle === 1){
                            let params = {
                                address_id: this.address.address_id,
                                name: this.address.name,
                                province: this.address.region[0],
                                city: this.address.region[1],
                                area: this.address.region[2],
                                street: this.address.street,
                                phone: this.address.phone,
                                post_code: this.address.post_code,
                                email: this.address.email,
                                is_default: this.address.is_default,
                            };
                            //修改收货地址
                            updateAddress(params).then(res => {
                                if(res.error_code === 0){
                                    //获取收货地址列表
                                    this.getAddressLists();
                                    //关闭新增编辑框，并进行表单重置
                                    this.handleClose();
                                }
                            });
                        }
                    }else{
                        this.innerVisible = true;
                    }
                });

            },
            //删除收货地址
            deleteAddress(address_id){
                this.$confirm("确定要删除该收货地址吗？","删除",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteAddress({address_id}).then(res => {
                        if(res.error_code === 0){
                            //获取收货地址列表
                            this.getAddressLists();
                        }
                    });
                }).catch(() => {});
            },
            //关闭新增编辑框，并进行表单重置
            handleClose(done){
                if(typeof(done) === 'function'){ //点击左上角的按钮
                    done();
                }else{ //点击保存收货地址成功后
                    this.visible = false;
                }
                this.$refs['address'].resetFields(); //表单重置
            },
        }
    };
</script>
