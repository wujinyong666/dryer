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
            <span class="marquee-text" :style="{ left: marquee.marqueeDistance + 'px', fontSize: marquee.size + 'px'}">
                <span>{{ marquee.text }}</span>
                <span v-if="deviceID">{{ marquee.deviceText }}</span>
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

            <!-- 如果不是扫码进入小程序的，需要在这里扫码 -->
            <div v-if="scanCodeShow" class="scanCode-box">
                <h3>点击扫一扫，开启美好生活！</h3>
                <div class="finger-box">
                    <div class="finger-img">
                        <img src="/static/icon/finger.png" alt="">
                    </div>
                </div>
                <mp-button type="primary" size="large" btnClass="mb15" @click="scanCodeHandle">扫一扫</mp-button>
            </div>

            <!--选择时长-->
            <div class="set-time" v-if="chargeSetShow">
                <h3>选择时长：</h3>
                <div class="time-box">
                    <div v-for="(item, index) in chargeSetList"
                         :key="index"
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
    import variate from "./variate";
    import mpButton from "mpvue-weui/src/button";
    import mpModal from "mpvue-weui/src/modal";
    import mpLoading from "mpvue-weui/src/loading";

    export default {
        components: {
            mpButton,
            mpModal,
            mpLoading
        },

        data() {
            return {
                variate,
                deviceID: "",
                bannerImgList: variate.bannerImgList,
                alipayContent: variate.alipayContent,
                closeContent: variate.closeContent,
                functionList: variate.functionList,
                chargeSetTimeIcon: "/static/icon/time.png",
                chargeSetmoneyIcon: "/static/icon/RMB.png",
                chargeSetList: variate.chargeSetList,
                currentChargeIndex: "",
                scanCodeShow: false, // 扫一扫窗口是否显示
                chargeSetShow: false,  // 费用选择窗口是否显示
                countDownShow: false, // 倒计时窗口是否显示
                finishShow: false, // 完成提示窗口是否显示
                countDown: {
                    endTime: 0,
                    guide: null
                },
                countDownText: "",
                isShowLoading: false,

                // 跑马灯
                marquee: {
                    text: "温馨提示：为了提高您的使用体验，请在使用设备前先阅读教程。",
                    deviceText: "",
                    marqueePace: 1,//滚动速度
                    marqueeDistance: 0,//初始滚动距离
                    marquee2_margin: 60,
                    size: 14,
                    interval: 20, // 时间间隔
                    length: 0,
                    windowWidth: 0,
                    marqueeTimer: null
                }
            };
        },

        created() {
            this.currentChargeIndex = 1;
        },

        onShow() {
            let that = this;

            try {
                const value = wx.getStorageSync("deviceID"); // 从缓存中获得设备ID
                if (value) {
                    this.deviceID = value;
                } else {
                    this.deviceID = "";
                }
            } catch (e) {
                this.deviceID = "";
            }

            // 跑马灯
            this.marquee.deviceText = "您扫码的设备ID是：" + this.deviceID;
            this.marqueeRun(); // 跑马灯运行

            if (!this.deviceID) {  // 如果没有扫码
                console.log("*** onShow 如果没有扫码");
                this.scanCodeShow = true;
                this.chargeSetShow = false;
                this.countDownShow = false;
                this.finishShow = false;
                return false;
            }

            this.countDownText = "";
            let beginTime = Math.round(new Date() / 1000); // 获得当前时间
            try {
                const value = wx.getStorageSync("endTime"); // 从缓存中获得结束时间
                if (value) {
                    this.countDown.endTime = value;
                }
            } catch (e) {
                this.countDown.endTime = 0;
            }
            /**
             *  获得上一次小程序退出时，窗口的显示状态；
             *  如果是倒计时窗口，并且此次进入程序的时间,大于设备运行结束时间，那么就显示完成窗口，其他窗口隐藏
             *  如果是倒计时窗口，并且此次进入程序的时间,还没有到达设备运行结束时间，那么仍然显示倒计时窗口，其他窗口隐藏
             *  如果上一次小程序退出时，窗口不是倒计时窗口，那么就显示扫一扫窗口，其他窗口隐藏
             */
            let beforeCountDownShow = null;
            wx.getStorage({
                key: "countDownShow",
                success(res) {
                    beforeCountDownShow = res.data;
                    if (beforeCountDownShow && beginTime >= that.countDown.endTime) {
                        that.scanCodeShow = false;
                        that.chargeSetShow = false;
                        that.countDownShow = false;
                        that.finishShow = true;
                    } else if (beforeCountDownShow && beginTime < that.countDown.endTime) {
                        that.timer(beginTime, that.countDown.endTime);
                        that.scanCodeShow = false;
                        that.chargeSetShow = false;
                        that.finishShow = false;
                        that.countDownShow = true;
                    } else {
                        that.scanCodeShow = true;
                        that.chargeSetShow = false;
                        that.finishShow = false;
                        that.countDownShow = false;
                    }
                }
            });
        },

        /**
         *  退出小程序窗口时执行：
         *  清除使用时长倒计时定时器；
         *  将运行结束时间存储道缓存中；
         *  将使用时长倒计时窗口显示状态存储道缓存中；
         *  清除跑马灯定时器
         */
        onHide() {
            this.resetCountDown();
            this.countDownText = "";
            wx.setStorage({
                key: "endTime",
                data: this.countDown.endTime
            });
            wx.setStorage({
                key: "countDownShow",
                data: this.countDownShow
            });
            clearInterval(this.marquee.marqueeTimer);
        },

        methods: {
            // 打开功能模块
            openFunction(index) {
                let url = '';
                switch (index) {
                    case 0:  // 我们
                        break;
                    case 1:  // 教程
                        break;
                    case 2:  // 客服
                        break;
                    case 3:  // 记录
                        url = "../myCenter/main";
                        mpvue.navigateTo({ url });
                        break;
                }
            },

            /**
             *  进入到小程序后，扫一扫设备二维码功能，获取使用设备ID;
             *  如果扫描成功获得设备ID，将其存储道缓存中，并显示费用选择窗口，其他窗口隐藏
             */
            scanCodeHandle () {
                let that = this;
                wx.scanCode({
                    success: (res) => {
                        wx.setStorage({
                            key: "deviceID",
                            data: res.result // 将设备ID存入缓存
                        });
                        that.deviceID = res.result;
                        that.marquee.deviceText = "您扫描的设备ID是：" + that.deviceID;
                        that.chargeSetShow = true;
                        that.scanCodeShow = false;
                        that.countDownShow = false;
                        that.finishShow = false;
                    },
                    fail: (res) => {
                        console.log(res);
                    }
                })
            },

            // 选择时长
            chargeChange(index) {
                this.currentChargeIndex = index;
            },

            // 点击支付启动
            alipayHandle() {
                this.$refs.alipayModal.show();
            },

            // 确定支付
            alipayConfirm() {
                this.scanCodeShow = false;
                this.chargeSetShow = false;
                this.finishShow = false;
                this.countDownShow = true;
                this.startCountDown();
            },

            // 取消支付
            alipayCancel() {
                console.log("返回首页");
            },

            // 开始倒计时
            startCountDown() {
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
                    this.countDownText = this.toDubms(m) + ":" + this.toDubms(s);
                    if (duration === 0) {
                        clearInterval(this.countDown.guide);
                        this.scanCodeShow = false;
                        this.chargeSetShow = false;
                        this.countDownShow = false;
                        this.finishShow = true;
                    }
                }, 1000);
            },

            // 补0操作
            toDubms(n) {
                if (n < 10) {
                    return "0" + n;
                } else {
                    return n;
                }
            },

            // 重置倒计时
            resetCountDown() {
                clearInterval(this.countDown.guide);
                this.countDown.guide = null;
            },

            // 关闭设备事件
            closeDeviceHandle() {
                this.$refs.closeModal.show();  // 弹出关闭设备确认的弹窗
            },

            /**
             *  使用结束（倒计时结束），确认关闭设备弹窗，设备ID置空且清除缓存设备ID，回到扫一扫窗口，为客户下次使用
             *  设备做准备
             */
            closeConfirm() {
                let that = this;
                this.resetCountDown();
                this.countDownText = "";
                this.deviceID = "";
                wx.removeStorage({
                    key: 'deviceID',
                    success(res) {
                        that.scanCodeShow = true;
                        that.chargeSetShow = false;
                        that.countDownShow = false;
                        that.finishShow = false;
                    }
                })
            },

            // 取消关闭设备弹窗
            closeCancel() {
                console.log("取消关闭，返回首页");
            },

            // 完成结束按钮
            finishHandle() {
                let that = this;
                this.countDownText = "";
                this.deviceID = "";
                wx.removeStorage({
                    key: 'deviceID',
                    success(res) {
                        that.scanCodeShow = true;
                        that.chargeSetShow = false;
                        that.countDownShow = false;
                        that.finishShow = false;
                    }
                })
            },

            marqueeRun() {
                let that = this;
                this.marquee.length = this.marquee.text.length * this.marquee.size; //文字长度
                this.marquee.windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
                this.marquee.marqueeDistance = this.marquee.windowWidth;
                this.marquee.marquee2_margin = this.marquee.length < this.marquee.windowWidth ?
                    this.marquee.windowWidth - this.marquee.length : this.marquee.marquee2_margin;

                this.marquee.marqueeTimer = setInterval(function() {
                    if (-that.marquee.marqueeDistance < that.marquee.length) {
                        that.marquee.marqueeDistance = that.marquee.marqueeDistance - that.marquee.marqueePace;
                    } else {
                        clearInterval(that.marquee.marqueeTimer);
                        that.marquee.marqueeDistance = that.marquee.windowWidth;
                        that.marqueeRun();
                    }
                }, that.marquee.interval);
            }
        } // methods end
    };
</script>

<style lang="less">
    @import "../../../static/css/common";
    @import "./index";
</style>
