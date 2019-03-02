import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

import 'mpvue-weui/src/style/weui.css';

const app = new Vue(App)
app.$mount()
