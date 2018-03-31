<template>
    <div class="admin-login">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <h3 class="title">系统登录</h3>
            <el-form-item prop="adminName">
                <el-input type="text" v-model="ruleForm.adminName" autoComplete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="adminPwd" v-model="ruleForm.password" autoComplete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss">
    @import '../../assets/css/base.scss';
    .admin-login{ min-height:100%; background: url(../../assets/img/bg1.jpg) center !important; background-size: cover;
        display:flex; align-items:center; justify-content:center;
        .el-form{ width: 500px; height:300px; margin-top:-200px; border-radius: 5px; background-clip: padding-box; padding: 35px 35px 15px 35px;
            background: #fff; border: 1px solid #eaeaea; box-shadow: 0 0 25px #cac6c6;
            .title{ margin: 0 auto 40px auto; text-align: center; color: #505458;}
            .remember { margin: 0 0 35px 0;}
        }
    }
</style>

<script>
    export default {
        name: 'admin-login',
        component: [],
        data() {
            return {
                logining: false,
                ruleForm: {
                    adminName: 'admin',
                    password: '123456'
                },
                rules: {
                    adminName: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                checked: true
            };
        },
        methods: {
            //管理员登录
            handleSubmit() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid){
                        this.logining = true;
                        let params = {adminName: this.ruleForm.adminName,password: this.ruleForm.password};

                        this.$store.dispatch("login",params).then(res => {
                            if(res.error_code === 0){
                                console.log(111);
                                this.$router.push({path: '/admin'});
                            }else if(res.error_code === 1){
                                this.$message.error({message: "输入管理员账号或者密码错误！",center: true,duration: 2000});
                                this.logining = false;
                            }
                        });
                    }
                });
            }
        }
    }
</script>
