<template>
    <div class="page-style my-center">
        <header>
            <div class="userinfo">
                <div class="userinfo-avatar">
                    <open-data  type="userAvatarUrl"></open-data>
                </div>
                <div class="user-name">
                    <open-data type="userNickName"></open-data>
                </div>
            </div>
        </header>

        <div class="record" v-if="hasRecord">
            <p>感谢您使用共享烘干机！</p>
            <p>累计使用次数：10次</p>
            <p>累计使用时长：10小时30分钟</p>
            <p>使用记录:</p>
            <ul class="record-details">
                <li>2019-02-01 12:00:00 ~ 2019-02-01 13:00:00</li>
                <li>2019-02-01 12:00:00 ~ 2019-02-01 13:00:00</li>
                <li>2019-02-01 12:00:00 ~ 2019-02-01 13:00:00</li>
            </ul>
        </div>

        <div class="invitation" v-if="!hasRecord">
            <p>共享烘干机诚邀你来体验！</p>
            <p>
                <a href="../index/main" class="go-index">返回首页扫一扫</a>，我们将为您提供便利、高效、舒适的生活体验！
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                hasRecord: true,  // 是否有记录
            };
        },

        created () {

        },

        methods: {

        }
    };
</script>

<style scoped lang="less">
    @import "../../../static/css/common";
    @import "./myCenter";
</style>
