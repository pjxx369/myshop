import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login/Login.vue'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [

    {
        path: '/',
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
    //路由守卫
router.beforeEach((to, from, next) => {
    // to将要访问路径
    if (to.path === '/login') {
        return next()
    }

    const token = window.sessionStorage.getItem('token')
    if (!token) {
        return next('/login')
    } else {
        next()
    }
    // from从哪个页面来
    // next表示方行
})

export default router