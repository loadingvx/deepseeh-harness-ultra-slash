#!/usr/bin/env bash
# 安装本仓库的 Node / pnpm，并装好插件依赖。
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v mise >/dev/null 2>&1; then
  echo "未找到 mise。请先在本机安装 mise：https://mise.jdx.dev/" >&2
  exit 1
fi

mise trust "$ROOT/.mise.toml" >/dev/null
mise install
mise exec -- pnpm install
echo "开发环境已就绪。接下来可以执行："
echo "  bash devops/test.sh     跑测试"
echo "  bash devops/build.sh    构建插件"
echo "  bash devops/dev.sh      装进 web profile 并启动界面"
