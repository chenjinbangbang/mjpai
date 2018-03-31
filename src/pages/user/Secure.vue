<template>
    <div class="info">
        <div class="top">
            <h2>修改密码</h2>
        </div>

        <div class="main">
            <el-form :model="users" ref="users" labelWidth="200px" :rules="rules">
                <el-form-item label="原密码" prop="oldUserPwd">
                    <el-input type="password" v-model="users.oldUserPwd" autoComplete="off" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newUserPwd">
                    <el-input type="password" v-model="users.newUserPwd" autoComplete="off" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="确认新密码：" prop="newUserPwdReg">
                    <el-input type="password" v-model="users.newUserPwdReg" autoComplete="off" placeholder=""></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="editUserPwd">修改</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-dialog :visible.sync="innerVisible">
            <p class="errorAlert" style="text-align:center; color:#f00;">
                <i class="el-icon-error"></i>
                <span>请输入正确的原密码或者新密码！</span>
            </p>
            <div slot="footer">
                <el-button type="default" @click="innerVisible = false">返 回</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="innerVisibleSuccess">
            <p class="errorAlert" style="text-align:center; color:#67C23A;">
                <i class="el-icon-success"></i>
                <span>修改密码成功！</span>
            </p>
            <div slot="footer">
                <el-button type="default" @click="innerVisibleSuccess = false">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<style lang="scss">
    .info{
        .main{ width:600px; text-align:left;

        }
    }
</style>

<script>
    import { updatePwd } from '@/api/users';
    import rules from '@/utils/validate';
    export default {
        name: 'info',
        components: {},
        data() {
            //密码验证
            let validPassword = (rule,value,callback) => {
                let valReg = /^[\w-]{6,18}$/;
                if(!valReg.test(value)){
                    callback(new Error('新密码必须为6-18位的字母/数字/_/-组成'));
                }else {
                    if(this.users.newUserPwd === this.users.oldUserPwd){
                        callback(new Error('原密码和新密码必须不一致'));
                    }
                    if (this.users.newUserPwdReg !== '') {
                        this.$refs.users.validateField('newUserPwdReg');
                    }
                    callback();
                }
            };
            //确认密码验证
            let validPasswordReg = (rule,value,callback) => {
                if(value !== this.users.newUserPwd){
                    callback(new Error('两次输入新密码不一致'));
                }else{
                    callback();
                }
            };
            return {
                users: {oldUserPwd: '',newUserPwd: '',newUserPwdReg: ''}, //用户信息
                innerVisible: false, //输入有误
                innerVisibleSuccess: false, //修改密码成功
                rules: {
                    oldUserPwd: [
                        {required: true,message: '请输入原密码',trigger: 'blur'},
                        {validator: rules.passwordRule, trigger: 'blur'}
                    ],
                    newUserPwd: [
                        {required: true,message: '请输入新密码',trigger: 'blur'},
                        {validator: validPassword, trigger: 'blur'}
                    ],
                    newUserPwdReg: [
                        {required: true,message: '请确认新密码',trigger: 'blur'},
                        {validator: validPasswordReg, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            //修改用户密码
            editUserPwd(){
                this.$refs['users'].validate((valid) => {
                    if(valid){
                        updatePwd({password: this.users.newUserPwd}).then(res => {
                            if(res.error_code === 0){
                                this.innerVisibleSuccess = true;
                                this.resetForm();
                            }
                        });
                    }else{
                        this.innerVisible = true;
                    }
                });
            },
            //表单重置
            resetForm(){
                this.$refs.users.resetFields();
            }
        }
    };
</script>
