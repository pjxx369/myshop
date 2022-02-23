import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import '@/assets/css/global.css'

import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'

import Fragment from 'vue-fragment'
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)


Vue.use(Fragment.Plugin)

Vue.use(VueAxios, axios)

Vue.use(ElementUI);


Vue.config.productionTip = false



new Vue({
    router,
    render: function(h) { return h(App) }
}).$mount('#app')