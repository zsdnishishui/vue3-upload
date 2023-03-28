import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';

import ElementPlus from 'element-plus';
// import 'element-plus/lib/theme-chalk/index.css';
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
const app = createApp(App).use(router).use(ElementPlus, { locale })

// 全局配置
app.config.globalProperties.$axios = axios
// 请求超时时间配置
axios.defaults.timeout=60000

app.mount('#app')

