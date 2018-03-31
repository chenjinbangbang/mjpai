<template>
    <div class='contact'>
        <h3>联系我们</h3>
        <ul>
            <li>
                <span>请加QQ群：</span>
                <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=9bf0a1a8517b78cb1212a5152363e5607833c457aa524fc49469f2df26223eba">
                    <img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="民间拍会员群" title="民间拍会员群">
                </a>
                <span>（群号：726351208）</span>
                </li>
            <li>
                <span>联系客服1：</span>
                <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1312480793&site=qq&menu=yes">
                    <img border="0" src="http://wpa.qq.com/pa?p=2:1312480793:41" alt="联系客服1" title="联系客服1"/>
                </a>
            </li>
            <li>
                <span>联系客服2：</span>
                <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:1653103050:51" alt="联系客服2" title="联系客服2"/></a>
            </li>

        </ul>
    </div>
</template>

<style lang="scss">
    @import '../assets/css/base';
    .contact{ text-align:center;
        h3{ color:$color; padding:20px 0;}
        ul{
            li{ height:40px; display:flex; justify-content:center; align-items:center;
                a{ margin:0 5px;
                    img{}
                }
            }
        }
    }
</style>

<script>
    export default {
        name: 'contact',
        components: {},
        data() {
            return {
                msg: ''
            }
        }
    }
</script>
