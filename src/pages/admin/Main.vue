<template>
    <div class='mainPage'>
        <el-container>
            <el-header>
                <h1 class="logo"><span>民间拍管理员系统</span></h1>
                <div class="entry"><router-link to="/">进入商城</router-link></div>
                <ul>
                    <li>
                        <!--<el-dropdown>
                            <el-button>
                                {{adminName}} <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><router-link to="/home/change-pwd">修改密码</router-link></el-dropdown-item>
                                <el-dropdown-item><a href="javascript:;" @click="logout">退出系统</a></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>-->
                        <el-button>
                            {{adminName}}
                        </el-button>
                    </li>
                    <li @click="logout">
                        <el-button @click="logout">退出系统</el-button>
                    </li>
                </ul>
            </el-header>
            <el-container>
                <el-aside width="240px">
                    <!--<div class="user">
                        <div class="photo">
                            <img src="../assets/images/tx.jpg">
                        </div>
                    </div>-->
                    <el-menu :defaultActive="routerIndex" :router="true">
                        <el-menu-item index="/admin">
                            <i class="el-icon-menu"></i>
                            <i class="el-icon-arrow-right"></i>
                            <span slot="title">用户管理</span>
                        </el-menu-item>
                        <el-menu-item index="/admin/goodslist">
                            <i class="el-icon-view"></i>
                            <i class="el-icon-arrow-right"></i>
                            <span slot="title">商品管理</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <transition name="fade">
                        <router-view/>
                    </transition>
                </el-main>
            </el-container>
            <!--<el-footer height="40px">footer</el-footer>-->
        </el-container>
    </div>
</template>

<style lang='scss'>
    @import '../../assets/css/base';
    .mainPage{ height:100%; background-color: #e0e8f5;
        .el-container{ height:100%;
            //头部
            .el-header{ box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .2); padding: 0 20px 0 0; display:flex; align-items:center; color:#fff; background: #20a0ff;
                .logo{ height: 60px; border-right:1px solid #fff; //background: #f44336;
                    span {display: inline-block;width: 240px;height: 60px;line-height: 60px;color: #fff;font-size: 24px;text-align: center;}
                }
                .entry{ margin-left:20px; font-size:14px;
                    a{ color:#fff;}
                }
                ul{ margin-left:auto; display:flex; align-items:center;
                    li{ cursor:pointer;
                        .el-button{ background-color:#20a0ff; color:#fff; border:none;}
                    }
                }
            }
            //导航
            .el-aside{ background-color: #fff;
                .user { padding: 20px 0;border-bottom: 1px solid #333e53;
                    .photo {width: 80px;height: 80px;margin: 0 auto; overflow: hidden; border-radius: 50%; border: 4px solid rgba(255, 255, 255, 0.3);
                        img {width: 100%;height: auto;}
                    }
                }
                .el-menu{ border-right:none; background-color: #1f2837;
                    li{ width:100%; border-bottom: 1px solid #333e53;
                        i{ color:#fff;
                            &:nth-child(2){
                                float: right; margin-top: 18px;
                            }
                        }
                    }
                    .el-submenu{
                        .el-submenu__title{ color:#fff;}
                    }
                    .el-menu-item{ color: #fff; border-left: 8px solid #1f2837;
                        &:hover{
                            background-color: #233342;
                            border-left-color: #f44336;
                        }
                        &.is-active{
                            background-color: #233342;
                            border-left-color: #f44336;
                            color: #ffd04b;
                        }
                    }
                    .el-submenu__icon-arrow{ display:none;}
                }
            }
            .el-main{
                //全局定义所有最小高度为100%
                >div{ min-height:100%; background-color: #fff;border-top: 4px solid #20a0ff;border-radius: 5px;box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);box-sizing: border-box; overflow: hidden;padding: 0 20px;
                    //.el-table__body-wrapper{overflow: hidden}
                    .title{
                        h2{font-size: 16px;}
                    }
                }
                //表单数据
                .dataForm{
                    .el-form{
                        .el-form-item{ .el-slider__button{ margin-top:-5px;}
                        }
                    }
                }
                //标题
                .title{ height:60px; display:flex; align-items:center; justify-content:space-between;
                    h2{ font-weight:normal;
                        .el-tag{ font-weight:bold;}
                    }
                    .search{ width:300px; margin-right:auto; margin-left:40px;  display:flex;
                        .el-input{}
                    }

                    .el-button{ margin-left:10px;}
                }
                //表格数据
                .tableLists{
                    .el-table{
                        .cell{ text-align:center;}
                        .el-switch__label{ color:#999;
                            &.is-active{ color:#409EFF;}
                        }
                        //暂无数据样式
                        //.el-table__empty-text{ left:5%;}
                    }
                }
                //分页样式
                .page{ display:flex; margin:20px 0;
                    .el-pagination{ margin-left:auto;}
                }
            }
            //尾部
            .el-footer{ position:fixed; background-color:#409EFF; width:100%; bottom:0;}
        }
    }
</style>

<script>
    export default {
        name: 'mainPage',
        components: {},
        data() {
            return {
                routerIndex: this.$route.path, //记录首页默认导航，el-menu必备
            };
        },
        computed: {
            adminName(){
                return this.$store.getters.adminName;
            }
        },
        methods: {
            //退出登录
            logout(){
                this.$confirm('您是否要退出系统？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message.success({message: '退出成功！',center: true,duration: 1200, onClose: () => {
                        localStorage.removeItem('adminName');
                        this.$router.push({path: '/admin/login'});
                    }});
                }).catch(() => {});
            }
        }
    };
</script>
