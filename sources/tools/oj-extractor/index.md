---
aside: false
---

# 📝 OJ 题目一键转 Markdown

> 在 Edge 中打开题目，一键抓取原始 Markdown，自动在 VSCode 中创建 `题目名.md`。

<BackLink to="/all/" label="返回工具列表" />

一个由两个扩展组成的配套工具：**Edge 扩展**负责拦截 OJ 题目页的 API 响应、提取题目原始 Markdown；**VSCode 扩展**负责接收数据、在当前工作区自动创建并打开 `题目名.md`。两者通过本机 WebSocket（端口 8765）通信，**所有数据都在你本地流转，不会上传到任何服务器**。

## 📥 下载

<div class="download-box">
  <DownloadCard
    platform="Edge 扩展"
    file="oj-edge-extension-v1.0.0.zip"
    note="解压后「加载解压缩的扩展」，约 4 KB"
    href="/downloads/oj-edge-extension-v1.0.0.zip"
  />
  <DownloadCard
    platform="VSCode 扩展"
    file="oj-file-creator-1.0.0.vsix"
    note="在 VSCode 中「从 VSIX 安装」，约 45 KB"
    href="/downloads/oj-file-creator-1.0.0.vsix"
  />
</div>

> 如果下载按钮点不开，请先确认安装包已经放进网站仓库的 `sources/tools/public/downloads/` 目录。

## 📋 基本信息

| 项目 | 内容 |
|---|---|
| 适用 OJ 平台 | 实验舱 OJ（`oj.shiyancang.cn`） |
| 适用浏览器 | Microsoft Edge（Chromium 内核） |
| 适用编辑器 | Visual Studio Code 1.85 及以上 |
| 通信方式 | 本机 WebSocket，`127.0.0.1:8765` |
| 当前版本 | v1.0.0 |
| 更新日期 | 2026-10-05 |

## ✨ 主要特点

- **一键抓取**：点一下浏览器图标，题目原文直接进 VSCode。
- **原始 Markdown**：不是渲染后的 HTML，公式、代码块、表格全部保留原样。
- **本地通信**：WebSocket 绑定在 `127.0.0.1`，不暴露到局域网、不上传云端。
- **免手动复制**：告别从网页里一点点粘贴公式和代码的麻烦。
- **自动命名**：文件以题目名称命名，方便按题号或题目名整理归档。
- **手动触发**：只有你点图标时才创建文件，浏览题目不会产生垃圾文件。

## 🛠️ 安装教程

### Step 1 · 安装 VSCode 扩展

1. 下载 `oj-file-creator-1.0.0.vsix` 文件。
2. 打开 VSCode，点击左侧 **扩展** 图标（方块图标）。
3. 点击扩展面板右上角的 `...` → 选择 **从 VSIX 安装...**。
4. 选择刚才下载的 `.vsix` 文件。
5. 安装完成后 **重启 VSCode**。
6. 重启后右下角应弹出通知：`OJ服务器已启动 (端口 8765)`。

> ⚠️ 如果没弹出通知，请检查是否已打开一个文件夹作为工作区。

### Step 2 · 安装 Edge 扩展

1. 下载 `oj-edge-extension-v1.0.0.zip` 文件。
2. **解压到一个固定文件夹**（不要删除，扩展会一直从这里加载）。
3. 打开 Edge，地址栏输入 `edge://extensions/` 回车。
4. 打开左下角的 **开发人员模式** 开关。
5. 点击 **加载解压缩的扩展** 按钮。
6. 选择刚才解压出来的文件夹（确保里面能看到 `manifest.json`）。
7. 加载成功后，列表里出现 **OJ Problem Extractor**。
8. 建议点击浏览器右上角的拼图图标，把它 **固定到工具栏**，方便使用。

> ⚠️ Edge 可能提示「此扩展程序可能不安全」，这是因为扩展未经商店签名，属于正常现象，选择「保留」即可。

### Step 3 · 开始使用

1. 确保 VSCode **已打开一个文件夹**（用于存放题目的工作区）。
2. 在 Edge 中打开 OJ 的题目页面。
3. 点击浏览器工具栏上的扩展图标。
4. 切回 VSCode，题目文件会自动创建并打开。

## 🎬 使用流程

```
打开 OJ 题目页
      ↓
自动缓存题目数据（不创建文件）
      ↓
点击 Edge 扩展图标
      ↓
VSCode 自动创建并打开 题目名.md
```

## 🔒 权限说明

**Edge 扩展请求的权限**

| 权限 | 用途 |
|---|---|
| `webRequest` | 拦截 OJ 页面的网络请求 |
| `storage` | 临时缓存最近一次抓取的数据 |
| `host_permissions: <all_urls>` | 用于在所有页面注入拦截脚本 |

**VSCode 扩展**

- 仅监听本机 `127.0.0.1:8765` 端口。
- 只在你指定的工作区文件夹中创建 `.md` 文件。

## 📝 更新日志

### v1.0.0（2026-10-05）

- 首次发布。
- 支持实验舱 OJ 题目抓取。
- 支持 Edge + VSCode 本地通信。
- 支持手动点击触发（避免误创建文件）。

## ❓ 遇到问题

安装步骤、端口占用、文件创建失败等问题，见 **[安装与常见问题](/oj-extractor/faq)**。

## 📄 许可

本项目仅供个人学习使用，请遵守目标 OJ 平台的使用条款。
