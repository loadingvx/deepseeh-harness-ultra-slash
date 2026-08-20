#!/usr/bin/env bash
# 构建插件、装进 web profile，并启动 Web UI。
# 不卸掉 workbench：两端都对 /ultra-slash 等资源做冲突让位，可共存。
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v mise >/dev/null 2>&1; then
  echo "未找到 mise。请先运行 devops/setup.sh" >&2
  exit 1
fi

mise exec -- pnpm run build

# shellcheck source=find-dsh.sh
source "${ROOT}/devops/find-dsh.sh"
if ! DSH_CMD="$(find_dsh)"; then
  explain_dsh_missing
  exit 1
fi

WEB_PKG="${HOME}/.dsh/profiles/web/package.json"
WEB_NM="${HOME}/.dsh/profiles/web/node_modules"

# 包名从 dsh-steer 迁到 deepseek-harness-ultra-slash 后，清掉旧条目和残留软链，
# 避免 profile 同时加载两份「同名旧包 + 新包」。
if [[ -f "$WEB_PKG" ]] && grep -q '"dsh-steer"' "$WEB_PKG"; then
  # shellcheck disable=SC2086
  eval $DSH_CMD plugin --profile web remove dsh-steer || true
fi
if [[ -e "${WEB_NM}/dsh-steer" || -L "${WEB_NM}/dsh-steer" ]]; then
  rm -rf "${WEB_NM}/dsh-steer"
fi

# shellcheck disable=SC2086
eval $DSH_CMD plugin --profile web add "$ROOT"

echo
echo "插件 deepseek-harness-ultra-slash 已安装到 web profile。正在启动 Web 界面…"
echo "浏览器打开 http://127.0.0.1:3080 →「对话」→ 输入 /steer、<内容>，或 /new、/skill、/docs。"
echo "自定义命令：设置 → 插件命令。改代码后重新执行本脚本，或先 devops/build.sh 再刷新 / 重启。"
echo "若 profile 里已有 workbench，双方会互相让位，harness 仍应正常启动。"
echo
exec bash "${ROOT}/devops/start-web.sh"
