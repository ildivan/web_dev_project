import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/global.css' 
import './assets/index.css' // Ensure main.css is imported

const app = createApp(App)
app.use(router)
app.mount('#app')
