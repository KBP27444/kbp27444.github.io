import DefaultTheme from 'vitepress/theme'
import ToolsHome from './components/ToolsHome.vue'
import ToolCard from './components/ToolCard.vue'
import BackLink from './components/BackLink.vue'
import DownloadCard from './components/DownloadCard.vue'
import './styles/tools.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ToolsHome', ToolsHome)
    app.component('ToolCard', ToolCard)
    app.component('BackLink', BackLink)
    app.component('DownloadCard', DownloadCard)
  }
}
