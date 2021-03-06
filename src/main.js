import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from "vue2-google-maps"
import vmodal from 'vue-js-modal'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import config from '../config/env'

Vue.use(VueGoogleMaps, {
  load: {
    key: config.KEY_GMAPS,
    libraries: "places" // necessary for places input
  }
})

Vue.use(vmodal)
Vue.use(VueSweetalert2)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
