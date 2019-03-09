<template>
    <div class="page-style us-box">
        <header>
            <img :src="bannerUrl" alt="">
        </header>
        <section>
            <p>
                我们是一支富有理想、激情的年轻团队，我们的小伙伴们均来自中国航天信息、环球易购、土巴兔等著名IT企业，
                具备多年的互联网产品开发经验，我们致力于为您提供便利、高效、舒适的生活体验！
            </p>
            <div class="contact">
                联系方式：
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
                bannerUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552121179840&di=5bcbf2e6190272ce245416d6fd1cb4bd&imgtype=0&src=http%3A%2F%2Fwww.chengru.net%2FImages%2F%25E5%2585%25B3%25E4%25BA%258E%25E6%2588%2591%25E4%25BB%25AC%2F%25E9%25A1%25B6%25E5%259B%25BE.png"
            };
        },

        created () {

        },

        methods: {}
    };
</script>

<style scoped lang="less">
    @import "../../../static/css/common";
    @import "us";
</style>
