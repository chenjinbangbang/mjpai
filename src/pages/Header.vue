<template>
    <header class="headerPage">
        <div class="logo">
            <router-link to="/">
                <ul>
                    <li><img src="../assets/img/logo.jpg" alt="" /></li>
                    <li>一个轻松赚钱的平台</li>
                </ul>
            </router-link>
        </div>
        <ul>
            <li><router-link to="/integral">如何赚取积分？</router-link></li>
            <li @click="register">注册</li>
            <li>
                <el-dropdown v-if="nickName" @command="handleCommand" trigger="click">
                    <span class="el-dropdown-link">
                        {{nickName}} <i class="el-icon-arrow-down el-icon-right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="user">个人中心</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <router-link to="/" v-else>登录</router-link>
            </li>
        </ul>

        <div class="cartIcon" v-if="nickName">
            <router-link to="/user/cart">
                <div class="num">{{cartLength}}</div>
                <!--<i class="el-icon-mobile-phone"></i>-->
                <i class="iconfont icon-cart"></i>
            </router-link>
        </div>

        <el-dialog title="注册" :visible.sync="visible" :beforeClose="handleClose" center :closeOnClickModal="false">
            <el-dialog :visible.sync="innerVisible" appendToBody>
                <p class="errorAlert" style="text-align:center; color:#f00;">
                    <i class="el-icon-error"></i>
                    <span v-if="ruleSuccess">请输入正确的注册信息！</span>
                    <span v-else>注册失败！{{error}}</span>
                </p>
                <div slot="footer">
                    <el-button type="default" @click="innerVisible = false">返 回</el-button>
                </div>
            </el-dialog>

            <el-form :model="user" ref="user" :rules="rules" labelWidth="120px">
                <el-form-item label="你的昵称：" prop="nickName">
                    <el-input v-model="user.nickName" autoComplete="off" placeholder="请输入你的昵称"></el-input>
                </el-form-item>
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="user.username" autoComplete="off" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="图形验证码：" prop="imgCode">
                    <el-col :span="10">
                        <el-input v-model="user.imgCode" autoComplete="off" placeholder="图形验证码"></el-input>
                    </el-col>
                    <el-col :span="5">
                        <div v-html="imgCode" @click="getImgCode" style="cursor:pointer;"></div>
                    </el-col>
                    <el-col :span="6">
                        <div v-if="codeTime === 0" @click="getCode">
                            <el-button type="primary">
                                获取手机验证码
                            </el-button>
                        </div>
                        <div v-else>
                            <el-button type="info">
                                {{codeTime}}秒后重发
                            </el-button>
                        </div>
                    </el-col>
                </el-form-item>
                <el-form-item label="手机验证码：" prop="code">
                    <el-input v-model="user.code" autoComplete="off" placeholder="手机验证码"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input type="password" v-model="user.password" autoComplete="off" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="passwordReg">
                    <el-input type="password" v-model="user.passwordReg" autoComplete="off" placeholder="请确认密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm">取 消</el-button>
                    <el-button type="primary" @click="submitForm" :loading="loading">注 册</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </header>
</template>

<style lang="scss">
    @import '../assets/icon/iconfont.css';
    .headerPage{ height:50px; display:flex; align-items: center;
        .logo{ margin-left:30px;
            ul{ display:flex; justify-content:center; align-items:center;
                li{ height:25px; font-size:16px; color:#999; padding:0 12px;
                    &:nth-child(1){ border-right:1px solid #ccc;}
                    img{ width:60px; display:block; margin-top:-3px;}

                }
            }

        }
        ul{ display:flex; margin-left:auto; margin-right:30px;
            li{ padding:0 5px; cursor:pointer;
                a{ color:#333;}
            }
        }
        .cartIcon{ width:50px; height:50px; line-height:50px; position:absolute; z-index:10; right:0; top:115px; cursor:pointer; text-align:center;
            a{ position:relative;
                .num{ width:18px; height:18px; line-height:18px; border-radius:50%; background-color:#f00; color:#fff; position:absolute; right:0; margin:5px;}
                i{ font-size:30px; margin:10px; color:#000;}
            }
        }
    }
</style>

<script>
    import rules from '@/utils/validate';
    import { nickNameReg,usernameReg,getCode,getPhoneCode,registerUser } from '@/api/login';
    import { getCartList } from '@/api/users';
    export default {
        name: 'headerPage',
        components: {},
        data (){
            //昵称验证
            let nickNameRule = (rule,value,callback) => {
                const valReg = /^[\u4e00-\u9fa5\w-]{4,18}$/; //4-18位的中文/字母/数字/_/-组成
                if(!valReg.test(value)){
                    callback(new Error('昵称必须为4-18位的中文/字母/数字/_/-组成'));
                }else{
                    nickNameReg({nickName: value}).then(res => {
                        if(res.error_code === 0){
                            callback();
                        }else{
                            callback(new Error('昵称已存在'));
                        }
                    });
                }
            };

            //用户名验证
            let usernameRule = (rule,value,callback) => {
                const valReg = /^1[34578]\d{9}$/; //手机号码
                if(!valReg.test(value)){
                    callback(new Error('手机号码格式有误'));
                }else{
                    usernameReg({username: value}).then(res => {
                        if(res.error_code === 0){
                            callback();
                        }else{
                            callback(new Error('手机号码已注册'));
                        }
                    });
                }
            };
            //密码的验证
            let passwordRule = (rule,value,callback) => {
                const valReg = /^[\w-]{6,18}$/; //6-18位的字母/数字/_/-组成
                if(!valReg.test(value)){
                    callback(new Error('密码必须为6-18位的字母/数字/_/-组成'));
                }else {
                    if (value !== '') {
                        this.$refs.user.validateField('passwordReg');
                    }
                    callback();
                }
            };
            //图形验证码的验证
            let imgCodeRule = (rule,value,callback) => {
                value = value.toLowerCase();
                if(value !== this.imgCodeText){
                    callback(new Error('图形验证码错误'));
                }else{
                    callback();
                }
            };
            //手机验证码的验证
            let codeRule = (rule,value,callback) =>{
                if(value !== this.code){
                    callback(new Error('手机验证码错误'));
                }else{
                    callback();
                }
            };
            //确认密码的验证
            let passwordRegRule = (rule,value,callback) =>{
                if(value !== this.user.password){
                    callback(new Error('两次输入密码不一致'));
                }else{
                    callback();
                }
            };
            return {
                visible: false, //注册框的显示与隐藏
                innerVisible: false, //弹出警告框
                ruleSuccess: false, //注册信息输入有误
                error: '', //注册错误信息
                //表单字段
                user: {
                    nickName: '我的唯一111',
                    username: '13570648982',
                    imgCode: '',
                    code: '',
                    password: '123456',
                    passwordReg: '123456'
                },
                imgCode: '', //图片验证码
                imgCodeText: '', //验证码
                code: '', //获取到的验证码
                codeTime: 0, //验证码倒计时
                loading: false,
                //验证表单规则
                rules: {
                    nickName: [
                        {required: true,message: '请输入昵称', trigger: 'blur'},
                        {validator: nickNameRule, trigger: 'blur'}
                    ],
                    username: [
                        {required: true,message: '请输入手机号码', trigger: 'blur'},
                        {validator: usernameRule, trigger: 'blur'}
                    ],
                    imgCode: [
                        {validator: imgCodeRule, trigger: 'blur'}
                    ],
                    code: [
                        {required: true,message: '请输入手机验证码', trigger: 'blur'},
                        {validator: codeRule, trigger: 'blur'}
                    ],
                    password: [
                        {required: true,message: '请输入密码', trigger: 'blur'},
                        {validator: passwordRule, trigger: 'blur'}
                    ],
                    passwordReg: [
                        {required: true,message: '请再次输入密码', trigger: 'blur'},
                        {validator: passwordRegRule, trigger: 'blur'}
                    ]
                }
            }
        },
        created(){
            //获取图形验证码
            this.getImgCode();

            //获取购物车数量
            if(this.nickName){
                this.$store.dispatch('getCartList').then(res => {});
            }
        },
        computed: {
            //昵称实时更新
            nickName(){
                return this.$store.getters.nickName;
            },
            //购物车列表数量实时更新
            cartLength(){
                return this.$store.getters.cartLength;
            }
        },
        methods: {
            //显示注册框
            register(){
                this.visible = true;
            },
            //获取图形验证码
            getImgCode(){
                getCode().then(res => {
                    if(res.error_code === 0){
                        this.imgCode = res.data.data;
                        this.imgCodeText = res.data.text.toLowerCase();
                    }
                });
            },
            //获取手机验证码
            getCode(){
                //确认手机号码是否正确
                this.$refs['user'].validateField("username",valid => {
                    if(valid){
                        this.$message({type: 'warning',center: true,message: '请输入正确的手机号码！'}); //提示需要输入正确的手机号码
                    }else{
                        //确认图形验证码输入是否正确
                        this.$refs['user'].validateField("imgCode",valid => {
                            if(valid){
                                this.$message({type: 'warning',center: true,message: '请输入正确的图形验证码，才能获取手机验证码！'}); //提示需要输入正确的图形验证码
                            }else{
                                getPhoneCode({username: this.user.username}).then(res => {
                                    switch(res.error_code){
                                        case 0:
                                            this.$message({ type: 'success', center: true, message: '验证码发送成功！'}); //提示验证发送成功
                                            this.code = res.data;
                                            //验证码倒计时
                                            this.codeTime = 60;
                                            setInterval(() => {
                                                if(this.codeTime !== 0){
                                                    this.codeTime--;
                                                }
                                            },1000);
                                            //60秒后验证码无效
                                            setTimeout(() => {
                                                this.code = '';
                                            },60000);
                                            break;
                                        case 1: //验证码操作频繁报错
                                            //console.log(res.result);
                                            this.$message({ type: 'error', center: true, message: res.data});
                                            break;
                                        default:
                                            break;
                                    }
                                });
                            }
                        });
                    }
                });
            },
            //提交表单信息
            submitForm(){
                this.$refs['user'].validate(valid => {
                    if(valid){
                         this.registerFn();
                    }else{
                        this.innerVisible = true;
                        this.ruleSuccess = true;
                    }
                });
            },
            //关闭注册框，并进行表单重置
            handleClose(done){
                done();
            },
            //表单重置
            resetForm(){
                this.visible = false;
                this.$refs['user'].resetFields();
            },
            //注册
            registerFn(){
                let params = {
                    nickName: this.user.nickName,
                    username: this.user.username,
                    password: this.user.password
                };

                //判断uid是否存在，存在就把它请求过去
                if(localStorage.getItem('uid')){
                    params.uid = localStorage.getItem('uid');
                }

                this.loading = true;
                this.$store.dispatch('registerUser',params).then(res => {
                    if(res.error_code === 0){
                        this.$message({type: 'success',center: true,message: '注册成功！',duration: 2000});
                        this.loading = false;
                        this.resetForm();
                        //获取购物车列表
                        this.$store.dispatch('getCartList').then(res => {});
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            //处理用户的个人中心和退出登录事件
            handleCommand(command){
                if(command === 'logout'){
                    this.logOut();
                }
                if(command === 'user'){
                    this.$router.push({path: '/user'});
                }
            },
            //退出登录
            logOut(){
                this.$confirm('您是否要退出登录？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message.success({message: '退出成功！',center: true,duration: 2000,onClose:() => {
                        this.$store.dispatch('LogOut').then(() => {
                            this.$router.push('/');
                        });
                    }});

                }).catch(() => {});
            },
        }
    }
</script>
