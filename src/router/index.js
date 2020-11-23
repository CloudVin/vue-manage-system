import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [{
        path: '',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home
    }
]

const router = new VueRouter({
        routes
    })
    //导航守卫来控制访问权限
router.beforeEach((to, from, next) => {
    // to是将要访问的组件
    if (to.path === '/login') return next();
    const token = window.sessionStorage.getItem("token");
    if (!token) return next('/login')
    next();


})

export default router