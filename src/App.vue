<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        //text-align: center;
        font-size:14px;
        color: #2c3e50;
        height:100%;
    }
    .el-dropdown-menu{
        a{ color:#000;
            &:hover{}
        }
    }
</style>

<script>

    export default {
        name: 'app',
        components: {},
        data () {
            return {

            }
        },
        mounted(){

        },
        methods: {

        }
    }
</script>


