// 載入Vue
import { createApp } from 'vue'

// 載入BS5 JS
import 'bootstrap'

// axios套件匯入
import axios from 'axios'
import VueAxios from 'vue-axios'

// VeeValidate套件匯入
import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate'
// 匯入 vee-validate 相關規則
import rules from '@vee-validate/rules'
// 匯入多國語系的功能
import { localize, setLocale } from '@vee-validate/i18n'
// 匯入繁體中文語系檔案
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

import App from './App.vue'
import router from './router'

Object.keys(rules).forEach(rule => {
  defineRule(rule, rules[rule])
})

// VeeValidate載入繁體中文語系
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true // 調整為輸入字元立即進行驗證
})
// VeeValidate設定預設語系
setLocale('zh_TW')

const app = createApp(App)

// 註冊 vee-validate 三個全域元件
app.component('Form', Form)
app.component('Field', Field)
app.component('ErrorMessage', ErrorMessage)

// 註冊 axios 元件
app.use(VueAxios, axios)
app.use(router)
app.mount('#app')
