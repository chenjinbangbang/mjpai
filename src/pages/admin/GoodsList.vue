<template>
    <div class="goodslist">

        <!--<div class="bigImg">
            <img src="/static/img/10_.jpg" alt="" />
        </div>-->

        <div class="dataForm">
            <el-dialog :title="operate === 0 ? '添加商品' : '修改商品'" :visible.sync="visible" :closeOnClickModal="false" :beforeClose="handleClose">
                <el-form :model="dataForm" ref="dataForm" labelWidth="150px">
                    <el-form-item label="编号：" prop="_id" v-if="operate !== 0">
                        <span>{{dataForm['_id']}}</span>
                    </el-form-item>
                    <el-form-item label="商品名称：" prop="product_name">
                        <el-input v-model="dataForm.product_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类：" prop="classify">
                        <el-select v-model="dataForm.classify" placeholder="请选择">
                            <el-option v-for="item in classify" :value="item" :key="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品价格：" prop="price">
                        <el-input-number v-model="dataForm.price" :min="0" :max="100000" size="small"></el-input-number>
                    </el-form-item>
                    <el-form-item label="商品图片：" prop="product_image" class="dataImage">
                        <!--{{dataForm.product_image}}-->
                        <ul>
                            <li v-for="(item,index) in dataUrl">
                                <img :src="item" alt="" @click="uploadClick(index)"/>
                                <div class="delete">
                                    <i class="el-icon-delete" @click.stop="deleteImage(index)"></i>
                                </div>
                            </li>
                            <li @click="uploadClick(null)">
                                <i class="plus el-icon-plus"></i>
                            </li>
                        </ul>
                        <input type="file" class="file" ref="file" @change="uploadImg" />
                        <p class="red">图片大小不能超过3MB，图片的格式必须为jpeg,png,gif，图片尺寸高宽必须大于等于500px，建议为800*800或1000*1000的尺寸</p>
                    </el-form-item>
                    <el-form-item label="商品库存：" prop="product_num">
                        <el-input-number v-model="dataForm.product_num" :min="0" :max="100000" size="small"></el-input-number>
                    </el-form-item>
                    <el-form-item label="" prop="detail" labelWidth="0">
                        <tinymce :height="300" v-model="dataForm.detail"></tinymce>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="saveForm">保 存</el-button>
                        <el-button type="info" @click="resetForm">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>

        <transition name="fade">
            <div class="viewImg" v-show="imgVisible" @click.self="imgVisible = false">
                <img :src="imgSrc" alt="">
            </div>
        </transition>

        <div class="title">
            <h2>商品管理</h2>
            <div class="search">
                <el-input v-model="search" placeholder="请输入商品名称..." prefixIcon="el-icon-search" @keyup.enter.native="searchClick" size="small"></el-input>
                <el-button type="primary" @click="searchClick" size="small">搜 索</el-button>
            </div>
            <el-button type="primary" @click="addRow" size="small">添 加</el-button>
        </div>

        <main class="tableLists">
            <el-table :data="tableLists" stripe border @sort-change="sortChange" v-loading="loading">
                <el-table-column prop="_id" label="编号" width="150"></el-table-column>
                <el-table-column prop="product_name" label="商品名称" sortable="custom" width="150"></el-table-column>
                <el-table-column prop="classify" label="分类" sortable="custom" width="100"></el-table-column>
                <el-table-column prop="price" label="商品价格" sortable="custom" width="110"></el-table-column>
                <el-table-column prop="product_image" label="商品图片" width="100">
                    <template slot-scope="scope">
                        <!--<a :href="scope.row.product_image[0]">-->
                            <img class="product_image" :src="scope.row.product_image[0]" alt="" @click="viewImg(scope.row.product_image[0])" />
                        <!--</a>-->
                    </template>
                </el-table-column>
                <el-table-column prop="product_num" label="商品库存" sortable="custom" width="110"></el-table-column>
                <el-table-column prop="volume" label="商品销量" sortable="custom" width="110"></el-table-column>
                <el-table-column prop="popularity" label="商品人气" sortable="custom" width="110"></el-table-column>
                <el-table-column prop="grade" label="商品评分" sortable="custom" width="110"></el-table-column>
                <el-table-column label="操作" width="250" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="editRow(scope.row['_id'])" size="small">修 改</el-button>
                        <el-button @click.native.prevent="deleteRow(scope.row['_id'])" size="small">删 除</el-button>
                        <router-link :to="{name: 'goodsdetail',params: {_id: scope.row['_id']}}">
                            <el-button type="danger" size="small">查看</el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
        </main>

        <div class="page">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10,20,50,100]"
                :page-size="pageSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<style lang="scss">
    //@import '../../assets/css/base';
    .goodslist{
        .el-dialog{ width:80%;}
        .viewImg{ width:100%; height:100%; position:fixed; top:0; left:0; z-index:10; display:flex; justify-content:center; align-items:center;
            background-color:rgba(0,0,0,0.8); cursor:pointer;
            img{ width:800px;}
        }
        .dataImage{
            ul{ display:flex; flex-wrap:wrap;
                li{ width:140px; height:140px; margin:5px; position:relative; cursor:pointer; border:1px solid #ccc; display:flex; align-items:center; justify-content:center;
                    .plus{ font-size:30px;}
                    .delete{ width:100%; height:30px; background-color:rgba(0,0,0,0.8); opacity:0; position:absolute; top:0; display:flex; align-items: center;
                        i{ color:#fff; font-size:16px; margin-left:auto; margin-right:5px;}
                    }
                    img{ max-width:100%; max-height:100%;}
                    &:hover{
                        .delete{ opacity:1;}
                        img{ opacity:0.8;}
                    }
                }
            }
            .file{ display:none;}
        }
        .product_image{ width:40px; cursor:pointer;}
    }
</style>

<script>
    //import VueQuillEditor from 'vue-quill-editor';
    import Tinymce from '@/components/Tinymce';
    import { getGoodsList,createGoods,getGoodsInfo,updateGoods,deleteGoods } from '@/api/admin';
    export default {
        name: 'goodslist',
        components: { Tinymce },
        data() {
            return {
                //表格数据
                tableLists: [],
                //表单数据
                dataForm: {_id: null,product_name: '苹果10x',classify: '电子产品',price: 0,product_image: [],product_num: 0,volumn: 0,popularity: 0,grade: 0,content: '<h1>1111111</h1>'},
                visible: false, //表单显示与隐藏
                imgVisible: false, //放大图片的显示与隐藏
                imgSrc: "", //放大图片的路径
                editId: 0, //点击修改的是哪个id
                operate: 0, //判断用户是添加（0）还是修改数据（1）
                classify: ['全部','男女服饰','化妆品','居家生活','美食特产','数码电器','母婴童装','鞋包配饰','文体户外','电子产品'], //商品分类
                dataUrl: [], //base图片
                dataUrlActive: null, //点击商品图片的索引，用于修改图片
                //查询
                search: '', //关键字查询字段
                query: {}, //所有查询条件
                loading: true, //加载数据
                //排序
                sortField: '', //排序字段
                sort: 0, //排序方式
                //表格当前分页数据
                currentTableLists: [],
                pageSize: 10, //一页有多少条数据
                currentPage: 1, //当前页
                total: 0, //总页数
            };
        },
        created(){
            //获取表格数据
            this.getTableLists();
        },
        methods: {
            /*----------------------表单数据与操作--------------------*/
            //点击上传
            uploadClick(index){
                this.dataUrlActive = index;
                //console.log('点击上传：'+this.dataUrlActive);
                this.$refs.file.click();
            },
            //上传商品图片
            uploadImg(){
                let file = this.$refs.file.files[0];
                if(file !== undefined){
                    console.log(file);
                    if(file.size/1024/1024 > 3){
                        this.$message.warning({message: '图片大小不能超过3MB',center: true});
                        return;
                    }
                    if(file.type.indexOf(/jpeg|png|gif/) > -1){
                        this.$message.warning({message: '图片的格式必须为jpeg,png,gif',center: true});
                        return;
                    }

                    let imgUrl = '/static/img/'+file.name;
                    let img = new Image();
                    img.src = imgUrl;
                    img.onload = () => {
                        if(img.width < 500 || img.height < 500){
                            this.$message.warning({message: '图片尺寸高宽必须大于等于500px',center: true});
                            return;
                        }
                        //将图片转化为base64格式
                        this.base64File(file);
                    };
                }
            },
            //将图片转化为base64格式（file点击）
            base64File(file){
                let self = this;
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function(){
                    //console.log('上传：'+self.dataUrlActive);
                    if(self.dataUrlActive !== null){
                        self.dataUrl.splice(self.dataUrlActive,1,this.result);
                        self.dataForm.product_image.splice(self.dataUrlActive,1,'/static/img/'+file.name);
                        return;
                    }
                    self.dataUrl.push(this.result);
                    self.dataForm.product_image.push('/static/img/'+file.name);
                }
            },
            //把图片转化为base编码（根据图片路径）
            getBase64Image(img){
                let canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                let ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                let ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
                let dataURL = canvas.toDataURL("image/"+ext);
                return dataURL;
            },
            //删除商品图片
            deleteImage(index){
                this.$confirm('确定删除该商品图片？','提示',{
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.dataUrl.splice(index,1);
                    this.$message.success({message: '删除该商品图片成功！',center: true});
                }).catch(() => {});
            },
            //获取表格数据
            getTableLists(){
                let params = {
                    search: this.search,
                    sort: this.sort,
                    sortField: this.sortField,
                    pageSize: this.pageSize,
                    currentPage: this.currentPage,
                };

                getGoodsList(params).then(res => {
                    if(res.error_code === 0){
                        this.tableLists = res.data.results;
                        this.total = res.data.total;

                        this.loading = false;
                    }
                })
            },
            //点击放大图片
            viewImg(src){
                this.imgVisible = true;
                this.imgSrc = src;
            },
            //点击添加数据
            addRow(){
                this.visible = true;
                this.operate = 0;
            },
            //点击修改数据
            editRow(_id){
                getGoodsInfo({_id}).then(res => {
                    if(res.error_code === 0){
                        this.dataForm = res.data;

                        this.dataUrl = [];
                        let imgs = this.dataForm.product_image;
                        for(let img of imgs){
                            let image = new Image();
                            image.src = img; //src属性一定要写到onload的后面，否则程序在IE中会出错
                            //console.log(image.src);
                            setTimeout(() => {
                                let base64 = this.getBase64Image(image);
                                this.dataUrl.push(base64);
                            },1000);
                        }
                        this.operate = 1;
                        this.visible = true;
                    }
                });
            },

            //保存数据
            saveForm(){
                this.$refs.dataForm.validate(valid => {
                    if(valid){
                        if(this.operate === 0){ //添加数据
                            createGoods(this.dataForm).then(res => {
                                if(res.error_code === 0){
                                    this.$notify({ title: '成功', message: '添加商品成功！', type: 'success'});
                                    this.getTableLists();
                                    this.resetForm();
                                }
                            });
                        }else if(this.operate === 1){ //修改数据
                            updateGoods(this.dataForm).then(res => {
                                if(res.error_code === 0){
                                    this.$notify({ title: '成功', message: '修改商品成功！', type: 'success'});
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
                    deleteGoods({_id}).then(res => {
                        if(res.error_code === 0){
                            this.$notify({ title: '成功', message: '删除商品成功！', type: 'success'});
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
                    this.dataForm = {_id: null,product_name: '',classify: '',price: 0,product_image: [],product_num: 0,volume: 0,popularity: 0,grade: 0,detail: ''};
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
                this.pageSize = 10;
                this.currentPage = 1;
                this.getTableLists();
            },
            /*----------------------分页--------------------*/
            //每页多少条数据
            handleSizeChange(val) {
                this.pageSize = val;
                this.tableListsChange();
            },
            //当前页
            handleCurrentChange(val){
                this.currentPage = val;
                this.tableListsChange();
            },
            //获取当前分页表格数据
            tableListsChange(){
                this.getTableLists();
            },
        }
    };
</script>
