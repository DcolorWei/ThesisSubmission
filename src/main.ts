import { createApp } from "vue";
import App from "./App.vue";

import "~/styles/index.scss";
import 'uno.css'
import "element-plus/theme-chalk/src/message.scss"
import { router } from "./route";

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:4523/m1/2476106-0-default'

const app = createApp(App);
app.use(router).mount("#app");

