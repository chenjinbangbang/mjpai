<template>
    <div class="grade">
        <div v-if="grades > 0">
            <img v-for="grade in grades" src="../assets/img/heart.png" alt="" />
        </div>
        <span v-else>暂无心</span>
    </div>
</template>

<style lang="scss">
    .grade{ display:inline-block;
        img{ width:18px; margin-left:2px;}
    }
</style>

<script>
    export default {
        name: 'grade',
        components: {},
        data() {
            return {
                grades: 0
            };
        },
        props: ['grade'],
        created(){
            this.grades = this.gradeFn(this.grade);

        },
        methods: {
            //等级分数对应的心数量
            gradeFn(grades){
                if(grades >= 5 && grades <= 10) return 1;
                if(grades > 10 && grades <= 50) return 2;
                if(grades > 50 && grades <= 200) return 3;
                if(grades > 200 && grades <= 500) return 4;
                if(grades > 500 && grades <= 1000) return 5;
            },
        }
    };
</script>
