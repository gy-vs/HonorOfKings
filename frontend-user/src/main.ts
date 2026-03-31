import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

// Custom directives
import vLoading from './directives/loading'
import vLazy from './directives/lazy'

// Global styles
import './assets/styles/global.scss'

const app = createApp(App)

// Register Element Plus Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// Register custom directives
app.directive('loading', vLoading)
app.directive('lazy', vLazy)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
