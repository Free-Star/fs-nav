import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 添加 Font Awesome CDN
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
document.head.appendChild(link)

createApp(App).mount('#app')
