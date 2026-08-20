import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: number
  dateText: string
  category: string
  tags: string[]
  wordCount: number
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default createContentLoader('/posts/**/*.md', {
  transform(raw) {
    return raw
      .map(({ url, frontmatter }) => {
        const date = frontmatter.date ? new Date(frontmatter.date) : null
        return {
          title: frontmatter.title || '未命名',
          url,
          date: date ? date.getTime() : 0,
          dateText: date ? formatDate(date) : '',
          category: frontmatter.category || '未分类',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          wordCount: frontmatter.wordCount || 0
        }
      })
      .filter((post) => post.date > 0)
      .sort((a, b) => b.date - a.date)
  }
})