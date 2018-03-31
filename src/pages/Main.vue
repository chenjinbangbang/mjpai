<template>
    <div class="mainAdmin">

        <header class="banner">
            <!--<el-dialog :visible.sync="innerVisible" appendToBody>
                <p class="errorAlert" style="text-align:center; color:#f00;">
                    <i class="el-icon-error"></i>
                    <span v-if="imgCodeError">请输入正确的图形验证码</span>
                    <span v-else>用户名或密码有误！!</span>
                </p>
                <div slot="footer">
                    <el-button type="default" @click="innerVisibleFn" size="mini">返 回</el-button>
                </div>
            </el-dialog>-->

            <div class="banner_home">
                <transition name="fade">
                    <el-form :model="dataForm" ref="dataForm" :rules="rules" v-if="!username">
                        <el-form-item prop="username">
                            <el-input v-model="dataForm.username" placeholder="请输入手机号码" prefix-icon="fa fa-user fa-lg"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="dataForm.password" placeholder="请输入密码" prefix-icon="fa fa-lock fa-lg"></el-input>
                        </el-form-item>
                        <!--<el-form-item prop="imgCode">
                            <el-col :span="16">
                                <el-input v-model="dataForm.imgCode" placeholder="图形验证码"></el-input>
                            </el-col>
                            <el-col :span="4">
                                <div v-html="imgCode" class="imgCode" @click="getImgCode"></div>
                            </el-col>
                        </el-form-item>-->
                        <el-form-item>
                            <el-button type="primary" @click="login" :loading="loading">登 录</el-button>
                        </el-form-item>
                    </el-form>

                    <div class="user" v-else>
                        <ul>
                            <li><label>您的昵称：</label><p>{{user.nickName}}</p></li>
                            <li><label>您的积分：</label><p>{{user.integral | toFix}}</p><p class="deduction">可抵扣{{user.integral/10 | toFix}}元</p></li>
                            <li><label>您的余额：</label><p>￥{{user.account | toFix}}</p></li>
                            <li v-if="user.grade"><label>会员等级：</label>
                                <el-tooltip effect="light" placement="right">
                                    <div slot="content">{{user.grade}}</div>
                                    <grade :grade="user.grade"></grade>
                                </el-tooltip>
                            </li>
                            <li><label>当前地区：</label><p>{{address}}</p></li>
                            <li><label>注册时间：</label><p>{{user.register_time}}</p></li>
                            <li><label>注册天数：</label><p>{{user.register_days}}天</p></li>
                            <li><label>签到次数：</label><p>{{user.sign_days_total}}次</p></li>
                        </ul>
                    </div>
                </transition>
            </div>
        </header>

        <!--<div class="xx" style="height:1000px;"></div>-->

        <main class="main">
            <div class="title">
                <h1>抽奖活动</h1>
                <div class="fresh">
                    <el-button type="primary" size="small" round @click="fresh">刷新</el-button>
                </div>
            </div>
            <div class="load" v-if="load">
                <div>
                    <i class="el-icon-loading"></i>
                </div>
                <p>抽奖商品加载中。。。</p>
            </div>
            <div class="goodsList" v-else>
                <div v-for="goods in goodsList">
                    <el-col :span="6">
                        <router-link :to="{name: 'goodsdetail',params: {_id: goods['_id']}}">
                            <div class="good">
                                <div class="award_status">
                                    <p v-if="goods.award.award_status === 0">未开始</p>
                                    <p v-if="goods.award.award_status === 1" class="red">进行中</p>
                                    <p v-if="goods.award.award_status === 2" class="info">已结束</p>
                                </div>

                                <div class="goodImg">
                                    <img :src="goods.product_image[0]" alt="" />
                                </div>

                                <div class="detail">
                                    <div class="name">{{goods.product_name}}</div>
                                    <div class="integral-salesVolume">
                                        <!--<h2 class="integral"><span>￥</span>0</h2>-->
                                        <p class="salesVolume">已卖出<span class="red">{{goods.volume > 0 ? goods.volume : 0}}</span>件，已有<span class="red">{{goods.award.people_num}}</span>人抽中</p>
                                    </div>
                                    <div class="xx">抽奖名额：<span class="red">{{goods.award.award_limit}}</span>个</div>
                                    <div class="yy">已参加抽奖：<span class="red">{{goods.award.award_num}}</span>人</div>
                                    <div class="time">抽奖时间：<span class="red">{{timeFormatFn(goods.award.time)}}</span></div>
                                    <div class="time">截止时间：<span class="red">{{timeFormatFn(goods.award.time_end)}}</span></div>
                                    <!--<div class="time1" v-if="goods.award.award_status === 0">距离抽奖：<span class="red">{{goods.award.left_time }}</span></div>-->
                                    <div class="time1" v-if="goods.award.award_status === 0">距离抽奖：<p v-html="goods.award.left_time"></p></div>
                                    <!--<div class="time2" v-else>距离截止：<span class="info">{{goods.award.left_time_end }}</span></div>-->
                                    <div class="time1" v-if="goods.award.award_status === 1">距离截止：<p v-html="goods.award.left_time_end"></p></div>
                                    <div class="time2" v-if="goods.award.award_status === 2">距离截止：<p class="info" v-html="goods.award.left_time_end"></p></div>
                                </div>
                            </div>
                        </router-link>
                    </el-col>
                </div>
                <div class="clearfix"></div>
            </div>
        </main>

    </div>
</template>

<style lang="scss">
    @import '../assets/css/base';
    .mainAdmin{
        .banner{ width:100%; height:400px; left:0; position:absolute; background:url("../assets/img/banner.jpg") no-repeat; //background-size:cover;
            display:flex; align-items:center;
            .banner_home{ width:1024px; margin:auto; display:flex; //border:1px solid #f00;
                .el-form{ width:400px; height:300px; background-color:#fff; margin-left:auto; padding:30px; border:2px solid #ccc; //border-radius:8px;
                    .el-input{ border:1px solid #eee;}
                    .imgCode{ width:100px; height:40px; border:1px solid #ccc; cursor:pointer; margin-left:10px;
                        svg{}
                    }
                    .el-button{ width:100%; background-color:#FF3F0E; border:1px solid #FF3F0E;}
                }
                .user{  width:350px; height:300px; margin-left:auto; padding:25px;
                    font-size:16px; color:#fff; background-color:rgba(0,0,0,0.8);
                    ul{
                        li{ height:32px; line-height:32px; display:flex; //border:1px solid #f00;
                            .deduction{ font-size:14px; color:#ccc;}
                            label{ width:80px; text-align:right;}
                            p{ margin-left:10px;}
                            .grade{ margin-left:10px;
                                img{ width:18px; margin-left:2px;}
                            }
                        }
                    }
                }
            }
        }
        .main{ padding-top:400px;
            .title{ height:80px; display:flex; align-items: center; border-bottom:1px solid #ccc;
                h1{ color:#f00; margin:auto;}
                .fresh{}
            }
            .load{ height:500px; display:flex; justify-content: center; align-items:center;
                i{ font-size:30px;}
                p{ margin-left:5px; font-size:14px;}
            }
            .goodsList{ width:100%; display:flex; justify-content: space-around; flex-wrap:wrap;
                >div{ width:48%; margin-top:20px; //border:1px solid #f00;
                    .el-col{ width:100%;
                        a{ color:#333; display:block;
                            .good{ border:1px solid #ccc; transition: all 1s; display:flex; position:relative;
                                &:hover{ border:1px solid $color;
                                    .goodImg{
                                        img{ transform:scale(1.05);}
                                    }
                                    .detail{
                                        .name{ color:#f00;}
                                    }
                                }

                                .award_status{ position:absolute; right:0; top:0; margin:8px; color:$color; z-index:1; font-size:16px;
                                    p{}
                                }
                                .goodImg{ width:200px; cursor:pointer; position:relative; overflow:hidden;
                                    img{ width:100%; transition: all 0.5s;
                                        &:hover{ //transform:scale(1.05);
                                        }
                                    }
                                }
                                .detail{ padding:0 15px 10px 15px;
                                    >div{ height:25px; line-height:25px;}
                                    .name{ text-align:left; cursor:pointer; font-weight:bold; margin-top:10px;
                                        &:hover{ //color:#f00;
                                        }
                                    }
                                    .integral-salesVolume{ display:flex; align-items:center; justify-content: space-between;
                                        .integral{ text-align:left; color:#f00; font-weight:normal;
                                            span{ font-size:14px;}
                                        }
                                        .salesVolume{ text-align:right;}
                                    }
                                    .xx{}
                                    .yy{}
                                    .time{}
                                    .time1{
                                        p{ display:inline-block;
                                            span{ font-size:20px; color:#f00;}
                                        }
                                    }
                                    .time2{
                                        p{ display:inline-block;
                                            span{ font-size:20px;}
                                        }
                                    }
                                }
                            }
                        }
                    }

                }

                .load-more{ height: 100px; line-height:100px; text-align:center;}
            }
        }
    }
</style>

<script>
    import { getCode,getUserInfo } from '@/api/login';
    import { getAwards } from '@/api/goods';
    import Grade from '@/components/grade';
    export default {
        name: 'mainAdmin',
        components: {Grade},
        data() {
            //用户名验证
            let usernameRule = (rule,value,callback) => {
                const valReg = /^1[34578]\d{9}$/; //手机号码
                if(!valReg.test(value)){
                    callback(new Error('手机号码格式有误'));
                    return;
                }
                callback();
            };
            //密码的验证
            let passwordRule = (rule,value,callback) => {
                const valReg = /^[\w-]{6,18}$/; //6-18位的字母/数字/_/-组成
                if(!valReg.test(value)){
                    callback(new Error('密码必须为6-18位的字母/数字/_/-组成'));
                    return;
                }
                callback();
            };
            //图形验证码的验证
            let imgCodeRule = (rule,value,callback) => {
                value = value.toLowerCase();
                if(value !== this.imgCodeText){
                    callback(new Error('请输入正确的图形验证码'));
                }else{
                    callback();
                }
            };
            return {
                //innerVisible: false, //弹出警告框
                imgCode: '', //图片验证码
                imgCodeText: '', //验证码
                //imgCodeError: true, //图形验证码有误
                loading: false, //登录加载
                address: "", //获取当前国家和城市
                user: {}, //用户数据
                grades: 0, //等级分数对应的心数量
                //表单字段
                dataForm: {
                    username: '13360502844',
                    imgCode: '',
                    password: '123456',
                },
                //验证表单规则
                rules: {
                    username: [
                        {required: true,message: '请输入手机号码', trigger: 'blur'},
                        {validator: usernameRule, trigger: 'blur'}
                    ],
                    imgCode: [
                        {required: true, message: '请输入验证码', trigger: 'blur'},
                        {validator: imgCodeRule, trigger: 'blur'}
                    ],
                    password: [
                        {required: true,message: '请输入密码', trigger: 'blur'},
                        {validator: passwordRule, trigger: 'blur'}
                    ]
                },
                goodsList: [], //抽奖的商品列表数据
                load: true, //抽奖商品加载中
            };
        },
        created(){

            //判断路由路径是否存在uid，存在就说明是推广链接，可保存在localStorage
            if(this.$route.query.uid){
                //console.log(this.$route);
                localStorage.setItem('uid',this.$route.query.uid);
            }


            //获取图形验证码
            this.getImgCode();
            if(this.username){
                this.getUserInfo();
            }

            //获取当前国家和城市
            this.getAddress();

            //获取抽奖的商品列表
            this.getAwards();

        },
        computed: {
            username(){
                return this.$store.getters.username;
            }
        },
        watch: {
            username(newVal,oldVal){
                if(newVal !== ""){
                    this.getUserInfo();
                }
            }
        },
        methods: {
            //获取当前国家和城市
            getAddress(){
                $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',() => {
                    //console.log(remote_ip_info);
                    this.address = `${remote_ip_info.country} ${remote_ip_info.city}`;
                });
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
            //登录
            login(){
                //确认图形验证码是否正确
                /*this.$refs['dataForm'].validateField('imgCode',valid => {
                    if(valid !== ''){
                        //this.imgCodeError = true;
                        //this.innerVisible = true;
                        return;
                    }*/
                    //确认用户名是否正确
                    this.$refs['dataForm'].validateField('username',valid => {
                        if(valid !== ''){
                            //this.imgCodeError = false;
                            //this.innerVisible = true;
                            return;
                        }
                        //确认密码是否正确
                        this.$refs['dataForm'].validateField('password',valid => {
                            if(valid !== ''){
                                //this.imgCodeError = false;
                                //this.innerVisible = true;
                                return;
                            }
                            let params = {
                                username: this.dataForm.username,
                                password: this.dataForm.password
                            };
                            this.loading = true;
                            this.$store.dispatch('LoginByUsername',params).then(res => {
                                if(res.error_code === 0){
                                    this.$message.success({message: '登录成功！',center: true,duration: 1000});
                                    this.getUserInfo();
                                    //获取购物车数量
                                    this.$store.dispatch('getCartList').then(res => {});
                                    this.resetForm();
                                }/*else if(res.error_code === 1){
                                    //this.imgCodeError = false;
                                    this.innerVisible = true;
                                }*/
                                this.loading = false;
                            }).catch(() => {
                                this.loading = false;
                            });
                        });
                    });
                //});
            },
            //获取用户信息接口
            getUserInfo(){
                getUserInfo().then(res => {
                    if(res.error_code === 0){
                        this.user = res.data;

                        this.gradeFn();
                    }
                })
            },
            //等级分数对应的心数量
            gradeFn(){
                let grades = this.user.grade;
                if(grades >= 5 && grades <= 10) this.grades = 1;
                if(grades > 10 && grades <= 50) this.grades = 2;
                if(grades > 50 && grades <= 200) this.grades = 3;
                if(grades > 200 && grades <= 500) this.grades = 4;
                if(grades > 500 && grades <= 1000) this.grades = 5;
            },
            //关闭错误弹出框
            /*innerVisibleFn(){
                this.innerVisible = false;
                if(this.imgCodeError){
                    this.dataForm.imgCode = "";
                }
            },*/
            //表单重置
            resetForm(){
                this.$refs['dataForm'].resetFields();
            },
            //点击刷新
            fresh(){
                //获取抽奖的商品列表
                this.getAwards();
            },
            //获取抽奖的商品列表
            getAwards(){
                this.load = true;
                getAwards().then(res => {
                    this.load = false;
                    if(res.error_code === 0){
                        this.goodsList = res.data.results;

                        this.goodsList.forEach(item => {

                            //计算距离抽奖时间
                            let award = JSON.parse(JSON.stringify(item.award)); //解耦
                            let leftTime,days,hours,minutes,seconds,setTime;
                            let leftTime1,days1,hours1,minutes1,seconds1,setTime1;

                            //距离抽奖时间
                            timeInterval();
                            setTime = setInterval(timeInterval,1000);
                            function timeInterval(){
                                leftTime = new Date(award.time)-new Date();

                                //判断抽奖的状态是否为：未开始或者进行中
                                if(leftTime > 0){ //未开始
                                    days = checkTime(parseInt(leftTime / 1000 / 60 / 60 / 24));
                                    hours = checkTime(parseInt(leftTime / 1000 / 60 / 60 % 24));
                                    minutes = checkTime(parseInt(leftTime / 1000 / 60 % 60));
                                    seconds = checkTime(parseInt(leftTime / 1000 % 60));

                                    //award.left_time = days + "天" + hours+ "时" + minutes+ "分" + seconds+ "秒";
                                    award.left_time = `<span>${days}</span> 天 <span>${hours}</span> 时 <span>${minutes}</span> 分 <span>${seconds}</span> 秒`;
                                    award.award_status = 0; //抽奖的状态，0为未开始，1为进行中，2为已结束
                                    item.award = award;
                                }else{ //进行中
                                    award.left_time = "00天00时00分00秒";
                                    award.award_status = 1;
                                    item.award = award;

                                    //距离截止时间
                                    timeInterval1();
                                    setTime1 = setInterval(timeInterval1,1000);

                                    clearInterval(setTime);
                                }
                            }

                            function timeInterval1(){
                                leftTime1 = new Date(award.time_end)-new Date();

                                //判断抽奖的状态是否为：进行中或者已结束
                                if(leftTime1 > 0){ //进行中
                                    days1 = checkTime(parseInt(leftTime1 / 1000 / 60 / 60 / 24));
                                    hours1 = checkTime(parseInt(leftTime1 / 1000 / 60 / 60 % 24));
                                    minutes1 = checkTime(parseInt(leftTime1 / 1000 / 60 % 60));
                                    seconds1 = checkTime(parseInt(leftTime1 / 1000 % 60));

                                    //award.left_time_end = days1 + "天" + hours1+ "时" + minutes1+ "分" + seconds1+ "秒";
                                    award.left_time_end = `<span>${days1}</span> 天 <span>${hours1}</span> 时 <span>${minutes1}</span> 分 <span>${seconds1}</span> 秒`;
                                    award.award_status = 1;
                                    item.award = award;
                                }else{ //已结束
                                    //award.left_time_end = "00天00时00分00秒";
                                    award.left_time_end = `<span>00</span> 天 <span>00</span> 时 <span>00</span> 分 <span>00</span> 秒`;
                                    award.award_status = 2;
                                    item.award = award;

                                    clearInterval(setTime1);
                                }
                            }

                            function checkTime(i){
                                if(i < 10){
                                    i = "0" + i;
                                }
                                return i;
                            }

                        });
                    }
                });
            }
        }
    };
</script>
