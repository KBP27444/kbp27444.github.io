@echo off
chcp 65001 >nul
echo 正在创建 OI 笔记分类文件夹...

:: 如果 docs 不存在则创建
if not exist "%~dp0docs" mkdir "%~dp0docs"
cd /d "%~dp0docs"

:: 创建所有分类文件夹（包括子文件夹）
mkdir 算法\排序 2>nul
mkdir 算法\分治 2>nul
mkdir 数据结构\ST表 2>nul
mkdir 数据结构\并查集 2>nul
mkdir 数据结构\栈 2>nul
mkdir 数据结构\线段树 2>nul
mkdir 数据结构\普及组 2>nul
mkdir 图论\最短路 2>nul
mkdir 图论\最小生成树 2>nul
mkdir 图论\二分图 2>nul
mkdir 图论\LCA 2>nul
mkdir 图论\普及组 2>nul
mkdir 动态规划\基础 2>nul
mkdir 数学\数论 2>nul
mkdir 数学\组合 2>nul
mkdir 字符串\Trie 2>nul
mkdir 字符串\哈希 2>nul
mkdir 字符串\基础 2>nul
mkdir 字符串\普及组 2>nul
mkdir 字符串\专题 2>nul
mkdir 搜索\DFS-BFS 2>nul
mkdir 搜索\剪枝 2>nul
mkdir 杂项 2>nul
mkdir 模板 2>nul

:: 在每个子文件夹里创建 index.md（自动写入一级标题）
echo # 排序 > 算法\排序\index.md
echo # 分治 > 算法\分治\index.md
echo # ST表 > 数据结构\ST表\index.md
echo # 并查集 > 数据结构\并查集\index.md
echo # 栈 > 数据结构\栈\index.md
echo # 线段树 > 数据结构\线段树\index.md
echo # 普及数据结构 > 数据结构\普及组\index.md
echo # 最短路 > 图论\最短路\index.md
echo # 最小生成树 > 图论\最小生成树\index.md
echo # 二分图 > 图论\二分图\index.md
echo # LCA > 图论\LCA\index.md
echo # 普及组树与图 > 图论\普及组\index.md
echo # 动态规划基础 > 动态规划\基础\index.md
echo # 数论 > 数学\数论\index.md
echo # 组合 > 数学\组合\index.md
echo # Trie > 字符串\Trie\index.md
echo # 哈希 > 字符串\哈希\index.md
echo # 字符串基础 > 字符串\基础\index.md
echo # 普及组字符串 > 字符串\普及组\index.md
echo # 字符串专题 > 字符串\专题\index.md
echo # DFS与BFS > 搜索\DFS-BFS\index.md
echo # 搜索与剪枝 > 搜索\剪枝\index.md
echo # 杂项 > 杂项\index.md
echo # 模板 > 模板\index.md

echo.
echo ✅ 所有文件夹和 index.md 已创建完成！
echo 现在可以往里面放你的 OI 笔记了。
pause