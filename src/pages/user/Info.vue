<template>
    <div class="info">
        <div class="top">
            <h2>个人信息</h2>
        </div>

        <main class="main">
            <el-form :model="users" ref="users" labelWidth="200px" :rules="rules">

                <el-form-item>
                    <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>
                    <img :src="previewAvatar" alt="">
                    <input ref="upload" id="upload" type="file" style="display:none;"/>
                </el-form-item>

                <el-form-item label="头像：">
                    <img :src="users.portrait" alt="" class="portrait">
                    <el-button type="primary" @click="imagecropperShow=true">上传头像</el-button>

                    <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess" langType="zh"
                                   :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>
                </el-form-item>

                <el-form-item label="用户名（手机号码）：">
                    <!--<el-input v-model="users.username" autoComplete="off" placeholder="" disabled></el-input>-->
                    <p>{{users.username}}</p>
                    <span class="colorSub">暂时无法修改</span>
                </el-form-item>
                <el-form-item label="昵称：" prop="nickName">
                    <!--<el-input v-model="users.nickName" autoComplete="off" placeholder="" disabled></el-input>-->
                    <p>{{users.nickName}}</p>
                    <span class="colorSub">暂时无法修改</span>
                </el-form-item>
                <el-form-item label="真实姓名：" prop="name">
                    <el-input v-model="users.name" autoComplete="off" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="sex">
                    <el-radio-group v-model="users.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                        <el-radio label="保密"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="editUser">保存</el-button>
                </el-form-item>
            </el-form>
        </main>

        <el-dialog :visible.sync="innerVisible">
            <p class="errorAlert" style="text-align:center; color:#f00;">
                <i class="el-icon-error"></i>
                <span>请输入正确的个人信息！</span>
            </p>
            <div slot="footer">
                <el-button type="default" @click="innerVisible = false">返 回</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<style lang="scss">
    @import '../../assets/css/base';
    .info{
        .main{ text-align:left;
            .portrait{ width:200px; border:1px solid #ccc;}
            p{ width:300px; display:inline-block;}
            .el-input{ width:300px;}
        }
    }
</style>

<script>
    import { getUserInfo1,updateUser } from '@/api/users';
    import ImageCropper from '@/components/ImageCropper'
    //import PanThumb from '@/components/PanThumb'
    export default {
        name: 'info',
        components: { ImageCropper },
        data() {

            //真实姓名的验证
            let name = (rule,value,callback) => {
                let valReg = /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/;
                if(value !== ''){
                    if(!valReg.test(value)){
                        callback(new Error('真实姓名格式有误！'));
                    }else{
                        callback();
                    }
                }else{
                    callback();
                }
            };

            return {
                files: [], //文件
                uploadToken: '', //上传文件token
                previewAvatar: '', //页面展示的avatar

                users: {portrait: "",useruame: "",nickName: "",name: '',sex: '保密'}, //用户信息
                //上传头像
                imagecropperShow: false,
                imagecropperKey: 0,
                //image: '',
                innerVisible: false, //输入有误弹出框
                //验证表单规则
                rules: {
                    name: [
                        {validator: name, trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '性别不能为空！'}
                    ],
                }
            };
        },
        mounted(){
            //获取用户信息
            this.getUsers();
        },
        methods: {
            update(event){

                let file = event.target.files[0];

                let formData = new FormData();
                //formData.append('name','xxxx');
                formData.append('file',file);
                console.log(formData.get('file'));

                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                };
                this.$http.post('http://localhost:8070/api/users/upload',formData,config).then(res => {
                    console.log(res);
                    this.previewAvatar = "";
                });


            },

            cropSuccess(resData) {
                //console.log(resData);
                this.imagecropperShow = false;
                this.imagecropperKey = this.imagecropperKey + 1;
                //this.image = resData.files.avatar;
                this.users.portrait = resData.files.avatar;
            },
            close() {
                this.imagecropperShow = false;
            },
            //获取用户信息
            getUsers(){
                getUserInfo1().then(res => {
                    if(res.error_code === 0){
                        //获取用户信息
                        this.users = res.data;

                        if(this.users.portrait === ""){
                            this.users.portrait = "https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191";
                        }
                    }
                });
            },
            //修改个人信息
            editUser(){
                this.$refs.users.validate((valid) => {
                    if(valid){
                        updateUser(this.users).then(res => {
                            if(res.error_code === 0){
                                this.$message.success({message: "修改用户信息成功！",center: true,duration: 1200});
                                //获取用户信息
                                this.getUsers();
                            }
                        });
                    }else{
                        this.innerVisible = true;
                    }
                });
            },
        }
    };
</script>
