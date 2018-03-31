<template>
    <div class="userinfo">
        <div class="top">
            <h2>账户信息</h2>
        </div>

        <main class="main">

            <div class="sign">
                <el-tooltip effect="dark" content="每天最多签到一次" placement="bottom">
                    <el-button type="warning" @click="sign">签到</el-button>
                </el-tooltip>
            </div>

            <ul>
                <li class="time">
                    <div>上次登陆的时间是：</div>
                    <div class="colorSub">{{user.last_login_time}}</div>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <div>本次登录IP：</div>
                    <div class="colorSub">{{user.ip}}</div>
                </li>
                <li class="detail">
                    您已连续签到了 <span class="red">{{user.sign_days_num}}</span> 天，今天签到可获得：<span class="red">{{user.get_integral}}</span> 积分
                    <el-tooltip effect="dark" content="点击了解更多积分详情" placement="bottom">
                        <router-link to="/integral">
                            <i class="iconfont icon-question" ></i>
                        </router-link>
                    </el-tooltip>
                </li>
                <li class="account">
                    <div>你的积分：</div>
                    <div class="colorSub">
                        <transition name="add">
                            <span class="add" v-if="addVisible">+{{user.get_integral}}</span>
                        </transition>
                        {{user.integral | toFix}}
                    </div>
                    &nbsp;<div>积分</div>&nbsp;&nbsp;&nbsp;&nbsp;
                    <div>会员等级：</div>
                    <el-tooltip effect="dark" placement="right" v-if="user.grade">
                        <div slot="content">{{user.grade}}</div>
                        <grade :grade="user.grade"></grade>
                    </el-tooltip>
                </li>
            </ul>
        </main>
    </div>
</template>

<style lang="scss">
    @import "../../assets/css/base";
    .userinfo{
        .main{ font-size:14px; padding-left:100px; text-align:left; position:relative;
            .sign{ position:absolute; right:0;
                .el-button--warning{ background-color:$color; border-color:$color;
                    &:hover{ opacity:0.9;}
                }
            }
            ul{
                li{ margin-top:20px;
                    &.time{ display:flex; align-items:center;
                        >div{
                            &:nth-child(odd){ font-weight:bold;}
                        }
                    }
                    &.detail{ font-weight:bold;
                        span{ font-size:24px;}
                        i{ font-size:20px; cursor:pointer; color:#000;}
                    }
                    &.account{ display:flex; align-items:center; position:relative;
                        >div{
                            .add{ position:absolute; top:-15px;}
                        }
                        .grade{
                            img{ width:18px; margin-left:2px;}
                        }
                    }
                }
            }

        }

    }
</style>

<script>
    import { getUserInfo,updateUserIntegral } from '@/api/users';
    import Grade from '@/components/grade';
    export default {
        name: 'userinfo',
        components: {Grade},
        data() {
            return {
                user: {}, //用户信息
                grades: 0, //等级分数对应的心数量
                addVisible: false, //增加积分的动画
                integral: 0, //用户积分
            };
        },
        mounted(){
            //获取用户信息
            this.getUser();
        },
        methods: {
            //获取用户信息
            getUser(){
                getUserInfo().then(res => {
                    if(res.error_code === 0){
                        this.user = res.data;

                        this.gradeFn();
                    }
                });
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
            //签到添加用户积分
            sign(){
                updateUserIntegral().then(res => {
                    if(res.error_code === 0){
                        //获取用户信息
                        setTimeout(() => {
                            this.getUser();
                        },500);

                        //增加积分的动画
                        this.addVisible = true;
                        setTimeout(() => {
                            this.addVisible = false;
                        },1000);
                    }
                });
            }
        }
    };
</script>
