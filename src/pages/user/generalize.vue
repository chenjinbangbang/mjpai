<template>
    <div class="generalize">
        <div class="top">
            <h2>我的推广</h2>
        </div>

        <div class="generUrl">
            <ul>
                <li>我的邀请链接：http://localhost:8070?uid={{invite_code}} <input type="text" id="invite_code" :value="'http://localhost:8070?uid='+invite_code"> <span @click="copy">复制</span></li>
                <li>对方通过你的邀请码链接进行注册即可，对方就能成为你的永久下级，增加你每天的收益</li>
            </ul>
        </div>

        <div class="generLogs">
            <h3>推广记录</h3>
            <el-table :data="generalizeList" style="width:100%" :border="true" stripe>
                <el-table-column prop="nickName" label="昵称"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="sex" label="性别"></el-table-column>
                <el-table-column prop="grade" label="会员等级">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="right">
                            <div slot="content">{{scope.row.grade}}</div>
                            <grade :grade="scope.row.grade"></grade>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="register_time" label="注册时间"></el-table-column>
            </el-table>
        </div>

        <div class="daterange">
            <el-date-picker v-model="daterange" type="daterange" size="small" @change="daterangeChange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
        </div>

        <div class="myChart" ref="myChart">
            您的浏览器不支持echarts，请用最新的浏览器浏览
        </div>

        <transition name="scale1">
            <el-alert title="复制成功，你可以粘贴分享给您的朋友了" type="success" show-icon center :closable="false" class="copyTip" v-show="copyTipVisible"></el-alert>
        </transition>

    </div>
</template>

<style lang="scss">
    @import '../../assets/css/base';
    .generalize{
        .generUrl{ border:1px solid $color; border-radius:10px; padding:20px;
            ul{
                li{ height:30px; line-height:30px;
                    #invite_code{ position:fixed; top:-1000px;}
                    span{ cursor:pointer; color:$color;}
                }
            }
        }
        .generLogs{ margin-top:20px;
            h3{ text-align:center;}
            .el-table{ text-align:center; margin-top:10px;
                th{ text-align:center; background-color:#ff3f0e; color:#fff; padding:8px 0;}
                td{
                    padding:5px 0;
                }
            }
        }
        .daterange{ text-align:right; margin-top:50px;}
        .myChart{ width:100%; height:400px; line-height:400px; text-align:center;}
        .copyTip{ position:fixed; top:25%; left:40%; width:30%; height:50px; border:1px solid #ccc;
            .el-alert__icon{ font-size:20px;}
            .el-alert__content{
                text-align:center;
                .el-alert__title{ font-size:14px;}
            }

        }

    }
</style>

<script>
    import { getInvite_code,getGeneralizeList,getCharts } from "@/api/users";
    import Grade from '@/components/grade';
    export default {
        name: 'generalize',
        components: {Grade},
        data() {
            return {
                invite_code: "", //推广邀请码
                copyTipVisible: false, //复制成功提示的显示与隐藏
                generalizeList: [], //推广记录
                daterange: [new Date(new Date().setTime(new Date().getTime()-24*60*60*1000*6)),new Date()], //日期范围
                pickerOptions: {
                    disableDate(time){
                        return time.getTime() > Date.now();
                    }
                }
            };
        },
        created(){
            //获取推广邀请码
            this.getInvite_code();
            //获取推广记录
            this.getGeneralizeList();
        },
        mounted(){
            //获取推广记录的日期和对应推广人数
            this.getCharts();
        },
        methods: {
            //获取推广邀请码
            getInvite_code(){
                getInvite_code().then(res => {
                    if(res.error_code === 0){
                        this.invite_code = res.data.invite_code;
                    }
                });
            },
            //复制推广邀请码
            copy(){
                let url = document.getElementById("invite_code");
                url.select();
                try{
                    if(document.execCommand("copy",false,null)){
                        document.execCommand("Copy");
                        this.copyTipVisible = true;
                        setTimeout(() => {
                            this.copyTipVisible = false;
                        },2000);
                        //console.log("已复制好，可粘贴");
                    }else{
                        console.log("复制失败，请手动复制");
                    }
                }catch(err){
                    console.log("复制失败，请手动复制");
                }
            },
            //获取推广记录
            getGeneralizeList(){
                getGeneralizeList().then(res => {
                    if(res.error_code === 0){
                        this.generalizeList = res.data.results;

                        //console.log(this.generalizeList);

                    }
                });
            },
            //选择日期范围
            daterangeChange(val){
                //console.log(val);
                //推广记录的详细统计图
                this.getCharts();
            },
            //推广记录的详细统计图
            getCharts(){

                getCharts({startDate: this.daterange[0],endDate:  this.daterange[1]}).then(res => {
                    if(res.error_code === 0){
                        //console.log(res);
                        let datas = res.data;

                        let dateArr = []; //日期数组xAxis
                        let values = []; //对应的值
                        datas.forEach(item => {
                            dateArr.push(item.time);
                            values.push(item.number);
                        });

                        let chart = this.$refs.myChart;
                        let myChart = this.$echarts.init(chart);

                        let option = {
                            title : {
                                text: '推广记录'
                            },
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                                data:['新增下级']
                            },
                            calculable : true,
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : false,
                                    data : dateArr,
                                    axisLine: {
                                        lineStyle: {
                                            color: '#666'
                                        }
                                    }
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    axisLabel : {
                                        formatter: '{value} '
                                    },
                                    axisLine: {
                                        lineStyle: {
                                            color: '#666'
                                        }
                                    }
                                }
                            ],
                            series : [
                                {
                                    name:'新增下级',
                                    type:'line',
                                    data: values,
                                    itemStyle: {
                                        color: '#ee7a23'
                                    },
                                    lineStyle: {
                                        color: '#ee7a23'
                                    },
                                    markPoint : {
                                        data : [
                                            {type : 'max', name: '最大值'},
                                            {type : 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine : {
                                        data : [
                                            {type : 'average', name: '平均值'}
                                        ]
                                    }
                                }
                            ]
                        };

                        myChart.setOption(option);
                    }
                });

            }
        }
    };
</script>
