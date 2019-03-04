<template>
    <div class="page-style my-center">

        <!--<open-data type="userAvatarUrl"></open-data>
        <open-data type="userNickName"></open-data>-->

        <header>
            <view class="userinfo">
                <view class="userinfo-avatar">
                    <open-data  type="userAvatarUrl"></open-data>
                </view>
                <open-data type="userNickName"></open-data>
            </view>
        </header>

        <div class="record">
            <p>感谢您使用共享烘干机！</p>
            <p>累计使用时长：10小时30分钟</p>
            <p>累计使用次数：10次</p>
            <p>使用记录:</p>
            <ul class="record-details">
                <li>2019-02-01 12:00:00 ~ 2019-02-01 13:00:00</li>
                <li>2019-02-01 12:00:00 ~ 2019-02-01 13:00:00</li>
                <li>2019-02-01 12:00:00 ~ 2019-02-01 13:00:00</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                headerImg: 'http://img.zcool.cn/community/01fcbc565d0ab432f87596471c72a0.jpg@900w_1l_2o_100sh.jpg',
                userName: 'John',
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
