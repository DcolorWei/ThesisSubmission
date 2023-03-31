import { createApp } from "vue";
import App from "./App.vue";

import "~/styles/index.scss";
import 'uno.css'
import "element-plus/theme-chalk/src/message.scss"
import { router } from "./route";

import axios from 'axios'
axios.defaults.baseURL = 'http://home.viger.xyz:9511'

const app = createApp(App);
app.use(router).mount("#app");

