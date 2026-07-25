@echo off
set /p t="Ìá½»×¢ÊÍ£º"
git add .
git commit -m "%t%"
git push
pause