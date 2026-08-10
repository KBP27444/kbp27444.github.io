@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 正在自动生成所有子目录的 index.md...

for /d /r %%d in (*) do (
    set "has_md="
    for %%f in ("%%d\*.md") do (
        if not "%%~nf"=="index" (
            set "has_md=1"
            >"%%d\index.md" echo # %%~nxd
            >>"%%d\index.md" echo.
            for %%g in ("%%d\*.md") do (
                if not "%%~ng"=="index" (
                    >>"%%d\index.md" echo - [%%~ng](./%%~ng)
                )
            )
            echo 已生成 %%d\index.md
        )
    )
)

echo 全部生成完成！按任意键退出...
pause >nul