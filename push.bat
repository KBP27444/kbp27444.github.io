@echo off
set /p b="是否重新构建全部站点（oi-notes / blog / tools）？(y/N)："
if /i "%b%"=="y" call npm run build:all

set /p t="提交注释："
git add .
git commit -m "%t%"
git push
pause