import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Viewer from '@/components/layout/Viewer'
import Line from '@/components/layout/Line'
import Analyzer from '@/components/layout/Analyzer'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/Viewer',
            name: 'Viewer',
            component: Viewer,
        },
        {
            path: '/Line',
            name: 'Line',
            component: Line,
        },
        {
            path: '/Analyzer',
            name: 'Analyzer',
            component: Analyzer,
        }
    ]
})