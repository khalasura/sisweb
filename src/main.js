// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// axios, vuex IE환경에서 사용가능(항상 최상위에서 사용해야 함)
import 'babel-polyfill'
import 'event-source-polyfill'

// 기본
import Vue from 'vue'
import App from './App'
import router from './router'

// vuex
import store from './store/store'

// flexible layout
import VueSplit from 'vue-split-panel'
Vue.use(VueSplit)

// image
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)

// bootstrap4
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

// chart
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
Vue.use(VueChartkick, Chart)

// checkbox
import checkbox from 'pretty-checkbox'
Vue.use(checkbox)

// modal
import VueSweetalert2 from 'vue-sweetalert2'
Vue.use(VueSweetalert2)

// session
import VueSession from 'vue-session'
Vue.use(VueSession)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})