<template>
    <div class="page-style index-page">
        <div class="banner-box">
            <swiper class="swiper" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
                <block v-for="(item, index) in bannerImgList" :index="index" :key="key">
                    <swiper-item>
                        <image :src="item" class="slide-image" mode="aspectFill"/>
                    </swiper-item>
                </block>
            </swiper>
        </div>

        <!--跑马灯-->
        <div class="marquee-box">
            <span v-show="deviceID" class="marquee-text" :style="{ left: marquee.marqueeDistance + 'px', fontSize: marquee.size + 'px'}">
                {{ marquee.text }}
            </span>
        </div>

        <div class="main-box">
            <!--功能模块-->
            <div class="function-box">
                <div v-for="(item, index) in functionList" :key="index" @click="openFunction(index)">
                    <img :class="item.className" :src="item.iconUrl" background-size="contain"/>
                    <span>{{ item.textName }}</span>
                </div>
            </div>
            <!--选择时长-->
            <div class="set-time" v-if="chargeSetShow">
                <h3>选择时长：</h3>
                <div class="time-box">
                    <div v-for="(item, index) in chargeSetList" :key="index"
                         :class="currentChargeIndex === index ? 'active' : ''"
                          @click="chargeChange(index, item)">
                        <p>
                            <img :src="chargeSetTimeIcon">
                            <span>{{ item.duration }} 分钟</span>
                        </p>
                        <p>
                            <img :src="chargeSetmoneyIcon">
                            <span>{{ item.price }} 元</span>
                        </p>
                    </div>
                </div>

                <mp-button type="primary" size="large" btnClass="mb15" @click="alipayHandle">支付启动</mp-button>
            </div>

            <!-- 倒计时 -->
            <div class="count-down" v-if="countDownShow">
                <h3>您正在使用共享干衣机，感谢您的惠顾！</h3>
                <h3>设备工作中...</h3>
                <div class="count-down-time">
                    <span> {{ countDownText }} </span>
                </div>

                <mp-button type="primary" size="large" btnClass="mb15" @click="closeDeviceHandle">关机结束</mp-button>
            </div>

            <!--完成提示-->
            <div class="finish-box" v-if="finishShow">
                <img src="/static/icon/finish.png" alt="">
                <mp-button type="primary" size="large" btnClass="mb15" @click="finishHandle">完成</mp-button>
            </div>
        </div>

        <!--支付启动弹窗-->
        <mp-modal ref="alipayModal"
                  :title="alipayContent.title"
                  :content="alipayContent.content"
                  :showCancel="true"
                  :cancelColor="alipayContent.cancelColor"
                  :confirmColor="alipayContent.confirmColor"
                  :confirmText="alipayContent.confirmText"
                  :cancelText="alipayContent.cancelText"
                  @confirm="alipayConfirm"
                  @cancel="alipayCancel">
        </mp-modal>

        <!--关闭设备弹窗-->
        <mp-modal ref="closeModal"
                  :title="closeContent.title"
                  :content="closeContent.content"
                  :showCancel="true"
                  :cancelColor="closeContent.cancelColor"
                  :confirmColor="closeContent.confirmColor"
                  :confirmText="closeContent.confirmText"
                  :cancelText="closeContent.cancelText"
                  @confirm="closeConfirm"
                  @cancel="closeCancel">
        </mp-modal>

        <mp-loading :showLoading="isShowLoading" loadingText="加载中..." mask="true"></mp-loading>
    </div>
</template>

<script>
    import variate from './variate'
    import mpButton from 'mpvue-weui/src/button';
    import mpModal from 'mpvue-weui/src/modal';
    import mpLoading from 'mpvue-weui/src/loading';

    export default {
        components: {
            mpButton,
            mpModal,
            mpLoading
        },

        data() {
            return {
                variate,
                deviceID: '',
                bannerImgList: variate.bannerImgList,
                alipayContent: variate.alipayContent,
                closeContent: variate.closeContent,
                functionList: variate.functionList,
                chargeSetTimeIcon: '/static/icon/time.png',
                chargeSetmoneyIcon: '/static/icon/RMB.png',
                chargeSetList: variate.chargeSetList,
                currentChargeIndex: '',
                chargeSetShow: true,  // 费用选择窗口是否显示
                countDownShow: false, // 倒计时窗口是否显示
                finishShow: false, // 完成提示窗口是否显示
                countDown: {
                    endTime: 0,
                    guide: null
                },
                countDownText: '',
                isShowLoading: false,

                // 跑马灯
                marquee: {
                    text: '',
                    marqueePace: 1,//滚动速度
                    marqueeDistance: 0,//初始滚动距离
                    marquee2_margin: 60,
                    size: 14,
                    interval: 20, // 时间间隔
                    length: 0,
                    windowWidth: 0,
                    marqueeTimer: null,
                },
            };
        },

        created () {
            this.currentChargeIndex = 1;
        },

        onShow () {
            let that = this;
            this.countDownText = '';
            let beginTime = Math.round(new Date() / 1000); // 获得当前时间
            try {
                const value = wx.getStorageSync('endTime') // 从缓存中获得结束时间
                if (value) {
                    this.countDown.endTime = value;
                }
            } catch (e) {
                this.countDown.endTime = 0;
            }
            let beforeCountDownShow = null;
            wx.getStorage({
                key: 'countDownShow',
                success(res) {
                    beforeCountDownShow = res.data;
                    if (beforeCountDownShow && beginTime >= that.countDown.endTime) {
                        that.chargeSetShow = false;
                        that.countDownShow = false;
                        that.finishShow = true;
                    } else if (beforeCountDownShow && beginTime < that.countDown.endTime) {
                        that.timer(beginTime, that.countDown.endTime);
                        that.chargeSetShow = false;
                        that.finishShow = false;
                        that.countDownShow = true;
                    } else {
                        that.chargeSetShow = true;
                        that.finishShow = false;
                        that.countDownShow = false;
                    }
                }
            })

            // 跑马灯
            this.deviceID = '123456';
            this.marquee.text = '温馨提示：为了提高您的使用体验，请在使用设备前先阅读教程。';
            this.marquee.text = this.marquee.text +  '您扫描的设备ID是：' + this.deviceID;
            this.marqueeRun();
        },

        onHide () {
            this.resetCountDown();
            this.countDownText = '';
            wx.setStorage({
                key: 'endTime',
                data: this.countDown.endTime
            })
            wx.setStorage({
                key: 'countDownShow',
                data: this.countDownShow
            })
            clearInterval(this.marquee.marqueeTimer);
        },

        methods: {
            // 打开功能模块
            openFunction (index) {
                switch (index) {
                    case 0:  // 我们
                        break;
                    case 1:  // 教程
                        break;
                    case 2:  // 客服
                        break;
                    case 3:  // 记录
                        const url = "../myCenter/main";
                        mpvue.navigateTo({ url });
                        break;
                }
            },

            // 选择时长
            chargeChange (index) {
                this.currentChargeIndex = index;
            },

            // 点击支付启动
            alipayHandle () {
                this.$refs.alipayModal.show();
            },

            // 确定支付
            alipayConfirm() {
                this.chargeSetShow = false;
                this.finishShow = false;
                this.countDownShow = true;
                this.startCountDown();
            },

            // 取消支付
            alipayCancel () {
                console.log("返回首页");
            },

            // 开始倒计时
            startCountDown () {
                let beginTime = Math.round(new Date() / 1000);
                let index = this.currentChargeIndex;
                let duration = this.chargeSetList[index].duration * 60;
                this.countDown.endTime = beginTime + duration;
                this.timer(beginTime, this.countDown.endTime);
            },

            // 计时器
            timer(beginTime, endTime) {
                let duration = endTime - beginTime + 1; // 运行时长
                let m = 0; // 分
                let s = 0; // 秒
                this.countDown.guide = setInterval(() => {
                    duration--;
                    m = parseInt(duration / 60 % 60, 10);
                    s = parseInt(duration % 60, 10);
                    this.countDownText = this.toDubms(m) + ':' + this.toDubms(s);
                    if (duration === 0) {
                        clearInterval(this.countDown.guide);
                        this.chargeSetShow = false;
                        this.countDownShow = false;
                        this.finishShow = true;
                    }
                }, 1000);
            },

            // 补0操作
            toDubms (n){
                if(n<10){
                    return "0"+ n;
                } else {
                    return n;
                }
            },

            // 重置倒计时
            resetCountDown () {
                clearInterval(this.countDown.guide);
                this.countDown.guide = null;
            },

            // 关闭设备事件
            closeDeviceHandle () {
                this.$refs.closeModal.show();  // 弹出关闭设备确认的弹窗
            },

            // 确认关闭设备弹窗
            closeConfirm() {
                this.resetCountDown();
                this.countDownText = '';
                this.chargeSetShow = true;
                this.countDownShow = false;
                this.finishShow = false;
            },

            // 取消关闭设备弹窗
            closeCancel () {
                console.log("取消关闭，返回首页");
            },

            // 完成结束按钮
            finishHandle() {
                this.chargeSetShow = true;
                this.finishShow = false;
                this.countDownShow = false;
            },

            marqueeRun () {
                let that = this;
                this.marquee.length = this.marquee.text.length * this.marquee.size; //文字长度
                this.marquee.windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
                this.marquee.marqueeDistance = this.marquee.windowWidth;
                this.marquee.marquee2_margin = this.marquee.length < this.marquee.windowWidth ?
                    this.marquee.windowWidth - this.marquee.length : this.marquee.marquee2_margin;

                this.marquee.marqueeTimer = setInterval(function () {
                    if (-that.marquee.marqueeDistance < that.marquee.length) {
                        that.marquee.marqueeDistance = that.marquee.marqueeDistance - that.marquee.marqueePace
                    } else {
                        clearInterval(that.marquee.marqueeTimer);
                        that.marquee.marqueeDistance = that.marquee.windowWidth;
                        that.marqueeRun();
                    }
                }, that.marquee.interval);
            },

        }, // methods end
    };
</script>

<style lang="less">
    @import "../../../static/css/common";
    @import "./index";
</style>
