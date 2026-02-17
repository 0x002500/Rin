import './styles/global.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Apply initial theme from localStorage or system preference
const applyInitialTheme = () => {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.dataset.theme = stored
      return
    }
  } catch (e) {
    /* ignore storage errors */
  }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light'
}
applyInitialTheme()

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
