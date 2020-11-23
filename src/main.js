import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入全局样式
import './assets/css/global.css'
//引入字体图标
import './assets/fonts/iconfont.css'
//i引入axios
import axios from 'axios'
//使用element插件
Vue.use(ElementUI)
    //设置全局配置，
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // 将axios引用给vue原型链,这样全局组件都能用axios
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')