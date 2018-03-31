<template>
    <div class="userslist">

        <div class="dataForm">
            <el-dialog :title="operate === 0 ? '添加用户' : '修改用户'" :visible.sync="visible" :closeOnClickModal="false" :beforeClose="handleClose">
                <el-form :model="dataForm" ref="dataForm" labelWidth="150px" :rules="rules">
                    <el-form-item label="用户编号：" prop="_id" v-if="operate !== 0">
                        <span>{{dataForm['_id']}}</span>
                    </el-form-item>
                    <el-form-item label="昵称：" prop="nickName">
                        <el-input v-model="dataForm.nickName"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名：" prop="username">
                        <el-input placeholder="请输入手机号码......" v-model="dataForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="dataForm.password"  v-if="operate === 0"></el-input>
                        <p v-else>{{dataForm.password}}</p>
                    </el-form-item>
                    <el-form-item label="性别：" prop="sex">
                        <el-radio-group v-model="dataForm.sex">
                            <el-radio :label="'男'"></el-radio>
                            <el-radio :label="'女'"></el-radio>
                            <el-radio :label="'保密'"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveForm">保 存</el-button>
                        <el-button type="info" @click="resetForm">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>

        <div class="title">
            <h2>用户管理</h2>
            <div class="search">
                <el-input v-model="search" placeholder="请输入昵称..." clearable prefixIcon="el-icon-search" @keyup.enter.native="searchClick" size="small"></el-input>
                <el-button type="primary" @click="searchClick" size="small">搜 索</el-button>
            </div>
            <el-button type="primary" @click="addRow" size="small">添 加</el-button>
        </div>

        <main class="tableLists">
            <el-table :data="tableLists" stripe border @sort-change="sortChange" v-loading="loading">
                <!--<el-table-column type="selection" fixed="left"></el-table-column>-->
                <!--<el-table-column type="index"></el-table-column>-->
                <el-table-column prop="_id" label="编号" width="220"></el-table-column>
                <el-table-column prop="nickName" label="昵称" sortable="custom" width="100">></el-table-column>
                <el-table-column prop="username" label="用户名" sortable="custom" width="200"></el-table-column>
                <el-table-column prop="password" label="密码" width="200"></el-table-column>
                <el-table-column prop="sex" label="性别" sortable="custom"></el-table-column>
                <el-table-column prop="register_time" label="注册时间" sortable="custom" width="200"></el-table-column>
                <el-table-column prop="name" label="真实姓名"></el-table-column>
                <el-table-column prop="account" label="账户余额" sortable="custom" width="200"></el-table-column>
                <el-table-column prop="grade" label="分数等级" sortable="custom" width="100"></el-table-column>
                <el-table-column prop="last_login_time" label="最新登录时间" sortable="custom" width="200"></el-table-column>
                <el-table-column prop="sign_time" label="签到时间" sortable="custom" width="200"></el-table-column>
                <el-table-column prop="sign_days_num" label="连续签到天数" width="200"></el-table-column>
                <el-table-column prop="get_integral" label="每天签到所获得的积分数" width="200"></el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="editRow(scope.row['_id'])" size="small">修 改</el-button>
                        <el-button @click.native.prevent="deleteRow(scope.row['_id'])" size="small">删 除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </main>

        <div class="page">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10,20,50,100]"
                :page-size="limit"
                layout="total,sizes,prev,pager,next,jumper"
                :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<style lang='scss'>
    .userslist{}
</style>

<script>
    import { getUsers,getUserInfo,createUser,updateUser } from '@/api/admin';
    export default {
        name: 'userslist',
        components: {},
        data() {
            //昵称的验证
            let nickName = (rule,value,callback) => {
                let valReg = /^[\u4e00-\u9fa5\w-]{4,18}$/;
                if(!valReg.test(value)){
                    callback(new Error('昵称必须为4-18位的中文/字母/数字/_/-组成'));
                }else{
                    callback();
                }
            };
            //用户名的验证
            let username = (rule,value,callback) => {
                let valReg = /^1[34578]\d{9}$/;
                if(!valReg.test(value)){
                    callback(new Error('手机号码格式有误！'));
                }else{
                    callback();
                }
            };
            ///密码验证
            let password = (rule,value,callback) => {
                let valReg = /^[\u4e00-\u9fa5\w-]{6,18}$/;
                if(!valReg.test(value)){
                    callback(new Error('密码必须由6-18位的中文/字母/数字/_/-组成'));
                }else{
                    callback();
                }
            };
            return {
                //表格数据
                tableLists: [],
                //表单数据
                dataForm: {_id: null,nickName: '我的唯一',username: '13570648982',password: '123456',sex: '女'},
                visible: false, //表单显示与隐藏
                editId: 0, //点击修改的是哪个id
                operate: 0, //判断用户是添加（0）还是修改数据（1）
                loading: true, //加载数据
                //查询
                search: '', //关键字查询字段
                query: {}, //所有查询条件
                //排序
                sortField: '', //排序字段
                sort: 0, //排序方式
                //表格当前分页数据
                currentTableLists: [],
                page: 1, //当前页
                limit: 10, //一页有多少条数据
                total: 0, //总页数
                //表单验证
                rules: {
                    nickName: [
                        {required: true,message: '请输入昵称！', trigger: 'blur'},
                        {validator: nickName, trigger: 'blur'}
                    ],
                    username: [
                        {required: true,message: '请输入手机号码！',trigger: 'blur'},
                        {validator: username,trigger: 'blur'}
                    ],
                    /*password: [
                        {required: true,message: '密码不能为空！',trigger: 'blur'},
                        {validator: password,trigger: 'blur'}
                    ],*/
                },
            }
        },
        mounted(){
            //获取表格数据
            this.getTableLists();
        },
        methods: {
            /*----------------------表单数据与操作--------------------*/
            //获取表格数据
            getTableLists(){
                let params = {
                    search: this.search,
                    sort: this.sort,
                    sortField: this.sortField,
                    page: this.page,
                    limit: this.limit
                };
                getUsers(params).then(res => {
                    if(res.error_code === 0){
                        this.tableLists = res.data.results;
                        //Date类型在服务器上是Object类型，返回回来的是String类型，所以必须使用new Date()转化为Object类型
                        this.tableLists.forEach(item => {
                            item.register_time = this.timeFormatFn(item.register_time);
                            item.last_login_time = this.timeFormatFn(item.last_login_time);
                            item.sign_time = this.timeFormatFn(item.sign_time);
                        });
                        this.total = res.data.total;

                        this.loading = false;
                    }
                });
            },
            //点击添加数据
            addRow(){
                this.visible = true;
                this.operate = 0;
            },
            //点击修改数据
            editRow(_id){
                this.editId = _id;
                getUserInfo({_id}).then(res => {
                    if(res.error_code === 0){
                        this.dataForm = res.data;

                        this.operate = 1;
                        this.visible = true;
                    }
                });
            },
            //保存数据
            saveForm(){
                this.$refs.dataForm.validate((valid) => {
                    if(valid){
                        if(this.operate === 0){ //添加数据
                            let params = this.dataForm;
                            createUser(params).then(res => {
                                if(res.error_code === 0){
                                    this.$notify({ title: '成功', message: '添加用户成功！', type: 'success'});
                                    this.getTableLists();
                                    this.resetForm();
                                }
                            });
                        }else if(this.operate === 1){ //修改数据
                            let params = this.dataForm;
                            updateUser(params).then(res => {
                                if(res.error_code === 0){
                                    this.$notify({ title: '成功', message: '修改用户成功！', type: 'success'});
                                    this.getTableLists();
                                    this.resetForm();
                                }
                            });
                        }
                    }
                });
            },
            //删除数据
            deleteRow(_id){
                this.$confirm('是否删除该数据？','提示',{
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteUser({_id}).then(res => {
                        if(res.error_code === 0){
                            this.$notify({ title: '成功', message: '删除用户成功！', type: 'success'});
                            this.getTableLists();
                        }
                    });
                }).catch(() => {});
            },
            //关闭表单，并重置表单
            handleClose(){
                this.resetForm();
            },
            //重置并退出
            resetForm(){
                setTimeout(() => { //解决快速点击2次时，表单已重置修改信息为空的问题
                    //两个一起解决重置问题
                    this.$refs.dataForm.resetFields();
                    this.dataForm = {_id: null,nickName: '',username: '',password: '',sex: '保密'};
                },500);
                this.visible = false;
            },
            /*----------------------排序--------------------*/
            sortChange(obj){
                this.sort = obj.order;
                this.sortField = obj.prop;
                this.getTableLists();
            },
            /*----------------------搜索--------------------*/
            //点击搜索
            searchClick(){
                this.limit = 10;
                this.page = 1;
                this.getTableLists();
            },
            /*----------------------分页--------------------*/
            //每页多少条数据
            handleSizeChange(val) {
                this.limit = val;
                this.tableListsChange();
            },
            //当前页
            handleCurrentChange(val){
                this.page = val;
                this.tableListsChange();
            },
            //获取当前分页表格数据
            tableListsChange(){
                this.getTableLists();
            },
        }
    }
</script>
