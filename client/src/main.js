import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store.js'
const fb = require('./firebaseConfig.js')
import './assets/scss/app.scss'
import VueCookie from 'vue-cookie'
import Notifications from 'vue-notification'

Vue.config.productionTip = false
Vue.use(VueCookie)
Vue.use(Notifications)

// handle page reloads
let app
fb.auth.onAuthStateChanged(user => {
    if (!app) {
        app = new Vue({
            el: '#app',
            router,
            store,
            render: h => h(App)
        })
    }
})