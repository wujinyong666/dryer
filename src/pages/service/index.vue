<template>
    <div class="page-style us-box">
        <header>
            <img :src="bannerUrl" alt="">
        </header>
        <section>
            <p>
                欢迎使用共享干衣机，我们将竭诚为您提供服务！
            </p>
            <div class="contact">
                客服联系方式：
                <p>
                    <img src="/static/icon/phone.png" alt="">
                    <span>17727908027</span>
                    <span>17727908027</span>
                </p>
                <p class="contact-wx">
                    <img src="/static/icon/weixin.png" alt="">
                    <img src="/static/icon/wx_john.png" alt="">
                </p>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                bannerUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552126276388&di=a65768e9cc8c16db1befbaa2f5fc4d59&imgtype=0&src=http%3A%2F%2Fwww.lingmaodianshang.com%2Fuploads%2F180807%2F1-1PPG5421YC.jpg'
            };
        },

        created () {

        },

        methods: {}
    };
</script>

<style scoped lang="less">
    @import "../../../static/css/common";
    @import "service";
</style>
