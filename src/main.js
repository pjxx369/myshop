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
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */ )
Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const h = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const s = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${mm}:${s}`
})

Vue.use(Fragment.Plugin)

Vue.use(VueAxios, axios)

Vue.use(ElementUI);


Vue.config.productionTip = false



new Vue({
    router,
    render: function(h) { return h(App) }
}).$mount('#app')