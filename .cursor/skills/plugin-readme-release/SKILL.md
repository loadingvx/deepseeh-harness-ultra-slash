---
name: plugin-readme-release
description: 维护 dsh-steer（deepseek-harness-ultra-slash 插件）的 README 与版本号时使用。涵盖 README 简洁结构与 npm / GitHub 两种安装命令的写法、以及 package.json 与两个 README 中所有需要同步版本号的位置、验证与发布命令。当任务涉及“清理 README / 更新 README / 写安装方式 / 升级版本号 / bump version / 版本升级 / 修改 README 中的 0.2.x 版本”时触发。
---

# 插件 README 与版本维护方案（dsh-steer）

维护对象：本仓库（npm 包名 `deepseek-harness-ultra-slash`；GitHub 仓库 `loadingvx/deepseeh-harness-ultra-slash`）。当前版本 **0.2.1**。

## 关键事实（已核实）

- npm 包名：`deepseek-harness-ultra-slash`（见 package.json 的 `name`）。
- GitHub 仓库名拼写是 **`deepseeh`**（不是 `deepseek`）：`loadingvx/deepseeh-harness-ultra-slash`，默认分支 `main`，必须包含构建好的 `lib/index.js` 和 `lib/client.js`（GitHub 安装不会在用户机器上编译）。
- `dsh plugin add` 底层是 pnpm：pnpm 对刚发布的版本有 24 小时保护，不带 `@版本号` 可能静默装到旧版——所以安装命令**必须锁定版本号**。
- 发布走 `bash devops/release.sh`（可带 `patch` / `minor` / `major` / `--dry-run`）：脚本自己 `npm version --no-git-tag-version` 递增、跑测试、构建并发布，发布时读取 package.json 的当前版本；**不会**同步 README，所以 README 里的版本号要手动改。
- `pnpm-lock.yaml` 不含本包自身的版本号（出现的 `0.2.x` 是依赖如 tinyglobby 的版本），升级版本时无需改动。

## README 规范（简洁版）

README.md（中文）与 README.en.md（英文）保持一一对应，只写：

1. 标题 + 语言切换链接（`[English](README.en.md) | 中文`）。
2. 截图展示：**保留现有的** `docs/imgs/screen_shot_zh.png` 和 `docs/imgs/screen_shot_config.png` 两张，不要删除。
3. 一句话介绍 + `## 功能`（英文 `## Features`）表格：`/steer`、`/new`、`/skill`、`/docs` 四条内置命令。
4. `## 安装`（英文 `## Install`）：
   - `### 从 npm 安装`（英文 `### From npm`）：
     ```sh
     dsh plugin --profile web add deepseek-harness-ultra-slash@<版本号>
     ```
     并说明 `@<版本号>` 不能省略（pnpm 24 小时保护）。
   - `### 从 GitHub 安装`（英文 `### From GitHub`）：
     ```sh
     dsh plugin --profile web add github:loadingvx/deepseeh-harness-ultra-slash
     ```
     并说明需要默认分支已构建好 `lib/index.js` 和 `lib/client.js`。
   - 装完重启 `dsh web`；以前装过旧包名 `dsh-steer` 的先执行 `dsh plugin --profile web remove dsh-steer`。
5. `## 许可证`（英文 `## License`）MIT。

不要写其它内容（不要放实现原理、详细使用教程、工程结构、本地开发等长篇）。

## 升级版本号

插件版本号是 `x.y.z`（当前 **0.2.1**）。升级版本时，版本号只出现在 **3 个文件、共 5 处**，一次改完即可；其余位置都无需改动。

### 需要更新的位置（共 5 处）

#### 1. `package.json`（唯一事实来源，1 处）

- L3：`"version": "0.2.1"`

#### 2. `README.md`（2 处，全部替换为同一新版本号）

- L28 安装命令：`dsh plugin --profile web add deepseek-harness-ultra-slash@0.2.1`
- L31 版本固定说明：``@0.2.1` 不能省略：pnpm 对刚发布的版本有 24 小时保护，不带版本号可能装到旧版。`

#### 3. `README.en.md`（2 处，与中文版一一对应）

- L28 安装命令：`dsh plugin --profile web add deepseek-harness-ultra-slash@0.2.1`
- L31 版本固定说明：`Do not omit `@0.2.1`: pnpm protects freshly published versions for 24 hours, and a bare install may pick an older release.`

### 刻意保留、不要改的旧版本字样

- 两个 README 中没有历史版本字样（0.2.0 已在升级时全部替换），只需把**当前版本号**整串替换即可。
- 若未来 README 中出现历史版本说明（如“不带版本号可能装到旧版”），属于历史事实，不要动。

### 无需改动的位置（已核实）

- **`pnpm-lock.yaml`**：不含根包 version；`tinyglobby@0.2.17` 之类是依赖版本，与本插件版本无关。
- **`lib/index.js` / `lib/client.js`**：构建产物；改版本后发布前执行 `bash devops/build.sh` 并把 lib 一起提交到 git。
- **`src/`、`tests/`、`docs/`、`devops/`、`cordis.patch.yml`**：无插件版本号引用。

### 改完后的验证

```bash
# 旧版本号应无残留（例如从 0.2.1 升到 0.2.2 后）：
grep -Frn '0.2.1' package.json README.md README.en.md   # 期望：无输出
# 新版本号应在 3 个文件共出现 5 次：
grep -Frn '0.2.2' package.json README.md README.en.md
```

### 发布流程

- `bash devops/release.sh` 基于 package.json 的 version 发布 npm；`patch` / `minor` / `major` 参数会用 `npm version --no-git-tag-version` 只改 package.json，**不会**同步 README——所以先手动改完 README 再发布。
- 发布前先 `--dry-run` 演练；发布前会自动跑测试和构建。
- 每次推 GitHub 前要提交构建好的 lib 文件（`lib/index.js`、`lib/client.js`），否则 GitHub 安装会失败。
