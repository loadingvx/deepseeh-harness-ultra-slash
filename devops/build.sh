#!/usr/bin/env bash
# 构建 Host 入口 lib/index.js。
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v mise >/dev/null 2>&1; then
  echo "未找到 mise。请先运行 devops/setup.sh" >&2
  exit 1
fi

mise exec -- pnpm run build
if [[ ! -f "$ROOT/lib/index.js" ]]; then
  echo "构建失败：缺少 lib/index.js。应用市场的 github: 安装依赖这份文件。" >&2
  exit 1
fi
if [[ ! -f "$ROOT/lib/client.js" ]]; then
  echo "构建失败：缺少 lib/client.js。斜杠菜单分组依赖浏览器半边。" >&2
  exit 1
fi
echo "构建完成：lib/index.js  lib/client.js"
echo "推 GitHub 前请把这份文件一并提交。市场命令 github: 装的是仓库内容，不会在用户机器上编译。"
