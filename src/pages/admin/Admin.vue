<template>
    <div class="admin">
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<style lang="scss">
    @import '../../assets/css/base';
    .admin{ height:100%;}
</style>

<script>
    export default {
        name: 'admin',
        components: {},
        data() {
            return {

            };
        }
    };
</script>
