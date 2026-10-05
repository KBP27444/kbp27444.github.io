/**
 * 工具站唯一数据源。
 *
 * 以后新增工具：在对应分类的 tools 数组里追加一项即可，页面自动出现。
 * 以后新增分类：在 categories 里追加一个对象即可，左侧分类栏和卡片网格自动跟随。
 * 注意：link 必须是「相对 base」的绝对路径，别写 /tools/ 前缀。
 *       VitePress 会自动补上 base（/tools/），本地 dev 也才正确。
 */

export interface ToolPlatform {
  /** 平台标签文案，例如 Edge / VSCode */
  label: string
  /** 悬停提示 */
  title?: string
}

export interface ToolItem {
  /** 工具名 */
  name: string
  /** 卡片上的一句话简介 */
  summary: string
  /** 平台标签，卡片上并排显示 */
  platforms: ToolPlatform[]
  /** 版本号，例如 v1.0.0 */
  version?: string
  /** 详情页路径（相对 base） */
  link: string
  /** 卡片图标 emoji */
  icon: string
}

export interface ToolCategory {
  /** 分类 id，用于 ?c=xxx */
  id: string
  /** 分类名 */
  label: string
  /** 分类图标 */
  icon: string
  /** 分类说明，显示在卡片网格标题下方 */
  desc: string
  tools: ToolItem[]
}

export const categories: ToolCategory[] = [
  {
    id: 'oj',
    label: 'OJ 刷题',
    icon: '📝',
    desc: '把 OJ 题目原文一键搬进 VSCode，专治手动复制公式和代码块。',
    tools: [
      {
        name: 'OJ 题目一键转 Markdown',
        summary:
          '在 Edge 里点一下扩展图标，题目原始 Markdown 自动在 VSCode 中创建为「题目名.md」，公式、代码块、表格原样保留。',
        platforms: [
          { label: 'Edge', title: 'Microsoft Edge（Chromium 内核）' },
          { label: 'VSCode', title: 'Visual Studio Code 1.85 及以上' }
        ],
        version: 'v1.0.0',
        link: '/oj-extractor/',
        icon: '📝'
      }
    ]
  }
]

/** 汇总全部工具，供 /tools/all/ 使用 */
export const allTools: Array<ToolItem & { categoryId: string; categoryLabel: string }> =
  categories.flatMap((category) =>
    category.tools.map((tool) => ({
      ...tool,
      categoryId: category.id,
      categoryLabel: category.label
    }))
  )
