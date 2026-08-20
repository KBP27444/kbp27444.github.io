import DefaultTheme from 'vitepress/theme'
import BlogLayout from './components/BlogLayout.vue'
import Home from './components/Home.vue'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout: BlogLayout,  // 替换默认布局
  enhanceApp({ app }) {
    app.component('Home', Home)
  }
}