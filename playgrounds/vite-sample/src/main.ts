import "./polyfill";
import { createApp } from 'vue'
import { createRainbowKitConfig } from './config'
import App from './App.vue'
import './style.css'
import '@raveyard/rainbowkit-vue/style.css';

const app = createApp(App);
createRainbowKitConfig(app).mount('#app');
