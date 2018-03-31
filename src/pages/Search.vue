<template>
    <div class="search">
        <input type="text" v-model="searchVal" @keyup.enter="searchClick" />
        <el-input placeholder="输入商品名称关键字..." v-model="searchVal">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchClick"></i>
        </el-input>
    </div>
</template>

<style lang="scss">
    .search{ height:80px; line-height:80px; background-color:#eee; text-align:center; position:relative;
        .el-input{ width:300px;
            i{ cursor:pointer;}
        }
    }
</style>

<script>
    export default {
        name: 'search',
        components: {},
        data() {
            return {
                searchVal: this.$store.state.searchVal, //搜索关键字
            };
        },
        computed: {

        },
        mounted(){

        },
        methods: {
            // 搜索关键字
            searchClick(){
                this.$store.commit('searchSend',this.searchVal);
            },

        }
    };
</script>
