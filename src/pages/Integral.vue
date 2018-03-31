<template>
    <div class="intergral">

        <div class="getintegral">
            <h3>如何赚取积分：</h3>
            <p>每天签到可获取积分，每天最多签到一次</p>
            <ol>
                <li>连续<span class="red">1</span>天签到，获得<span class="red">1</span>积分。</li>
                <li>连续<span class="red">2</span>天签到，获得<span class="red">2</span>积分。</li>
                <li>连续<span class="red">5</span>天签到，获得<span class="red">3</span>积分。</li>
                <li>连续<span class="red">10</span>天签到，获得<span class="red">4</span>积分。</li>
                <li>连续<span class="red">20</span>天签到，获得<span class="red">5</span>积分。</li>
            </ol>
        </div>

        <div class="gradeDetails">
            <h3>会员等级：</h3>
            <p>购买一件商品，无论是否好评，中评或者差评，都可获得一分，其会员等级分为以下5个级别</p>
            <img src="../assets/img/heartUrle.jpg" alt="" />
        </div>

        <div class="intergral_daily">
            <h3>每天收益不断：</h3>
            <p>每天收益积分 = 推广人数 * 会员等级 * 10%，如下：</p>
            <table border="1" cellspacing="0">
                <tr><th>推广人数</th><th>会员等级</th><th>每天获取积分</th></tr>
                <tr><td>1</td><td>1</td><td>0.1</td></tr>
                <tr><td>10</td><td>1</td><td>1</td></tr>
                <tr><td>20</td><td>2</td><td>4</td></tr>
                <tr><td>50</td><td>2</td><td>10</td></tr>
                <tr><td>100</td><td>3</td><td>30</td></tr>
                <tr><td>200</td><td>3</td><td>60</td></tr>
                <tr><td>500</td><td>4</td><td>200</td></tr>
                <tr><td>1000</td><td>5</td><td>500</td></tr>
            </table>
        </div>

    </div>
</template>

<style lang="scss">
    .intergral{ font-size:14px;
        h3{ color:#f00;}
        p{ margin-top:10px; font-weight:bold;}
        >div{ margin-top:30px;}
        .getintegral{
            ol{ list-style-type: decimal; margin-left:15px;
                li{ margin-top:15px;
                    span{ color:#f00; font-size:16px;}
                }
            }
        }
        .gradeDetails{
            img{ margin-top:15px;}
        }
        .intergral_daily{
            table{ width:500px; margin-top:10px; text-align:center; border:1px solid #ccc;
                tr{
                    th,td{ height:30px;}
                    th{}
                    td{}
                }
            }
        }
    }
</style>

<script>
    export default {
        name: 'intergral',
        components: {},
        data() {
            return {
                msg: 'template'
            };
        }
    };
</script>
