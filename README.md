# deepseek-harness-ultra-slash

[English](README.en.md) | 中文

DeepSeek Harness 的 **Ultra Slash** 插件：在会话输入框的 `/` 菜单里单独一组「插件命令」，和 DSH 自带命令分开。

内置四条：

| 命令 | 做什么 | 会不会打断当前对话 |
| --- | --- | --- |
| `/steer 内容` | 把内容交给模型的**下一步** | 不会 |
| `/new` | 开启空白会话（和左侧「新会话」一样） | 正在跑的对话**不会被停止**，可在左侧点回去 |
| `/skill` | 等于 `/steer` 加上「完成后把方案存成当前项目的 skill」 | 不会 |
| `/docs` | 等于 `/steer` 加上「完成后把原因和方案写成 docs 里的 md」 | 不会 |

还可以在 **设置 → 插件命令** 里给常用的 `/steer` 内容起短名字，例如 `/review`。

## 它做什么

打开 `/` 时，本插件的命令出现在**最下面**的 **插件命令**（英文界面是 Ultra Slash）分组里，排在 DSH 自带的 `/help`、`/plan` 等下面，中间有分割线，**不会**跟它们排在一起。说明跟界面语言走：中文显示中文，英文显示英文。

`/steer`、`/skill`、`/docs` 和自定义命令走的都是 Harness 已有的 `agent.steer()`：**下一步访问大模型时注入**，当前这一步继续跑完。模型正在跑的时候，普通再发一条消息往往会排到下一轮，或者你得先点停止。

| 你现在的状态 | `/steer 先不要改代码` 之后 |
| --- | --- |
| 模型正在思考 / 调工具 | 当前回合不中断。下一次访问大模型时会看到这段话 |
| 模型空闲 | 立刻开始下一步，并把这段话带给模型 |
| 只打了 `/steer`，后面没字 | 不会注入任何内容。界面会告诉你怎么写 |

`/skill` 和 `/docs` 后面也可以再写补充说明，会接在固定内容后面一起注入。可以连续执行多次。每一条都会排队，不会互相覆盖。

## 自定义命令

1. 打开左侧 **设置**。
2. 点导航里的 **插件命令**。
3. 在「自定义命令」里填写：
   - **命令名**：不用写斜杠。例如填 `review`，之后输入 `/review`。
   - **菜单说明**（可选）：出现在 `/` 菜单这一行的右边。
   - **注入内容**：发送后模型下一步会看到的文字，效果和 `/steer` 这段内容一样。
4. 点 **添加命令**。成功后立刻可以在输入框使用，不用重启。

名单保存在本机 `$DSH_HOME/ultra-slash/commands.json`（默认 `~/.dsh/ultra-slash/commands.json`），所有会话共用。最多 40 条。不能占用 `/steer`、`/new`、`/skill`、`/docs` 以及 DeepSeek Harness 已有的命令名。

改错了可以点「编辑」或「删除」。删除前会再问一次。添加失败时，原来的名单不会被改掉。

## 实现原理：`/steer` 怎么进到下一次模型调用

`/steer` 不是只在界面上做样子，也不是什么黑魔法。它走的是 Harness 内部真实存在的 `agent.steer()` 通道，下面每一步都能在 `deepseek-harness` 源码里对上号。

1. **注册命令（Host 半边）** — `src/index.ts` 的 `apply()` 通过 `ctx.commands.register({ name: 'steer', ... })` 注册斜杠命令。输入 `/steer 文本` 后，处理器 `executeSteer()` 校验输入、构造一条 `role: 'user'` 的下一步消息（`src/message.ts`），然后调用 `invocation.agent.steer(message)`。

2. **Harness 的 `Agent.steer()`** — `packages/core/agent-loop/src/agent.ts` 里：

   ```ts
   steer(input) { this.send(input, 'next-step', true) }   // 排队到 next-step，并唤醒驱动
   ```

   `send()` 把消息插进 Inbox 的 `next-step` 队列（`inbox.splice('next-step', …)`），并持久化一条 `agent/inbox/spliced` 会话事件——所以排队是**可恢复**的，不是内存里的临时状态。若 agent 空闲，`wakeDriver()` 立刻开启新一轮；若正在跑，消息就安静地等在队列里，什么都不打断。

3. **回合循环按「步骤边界」消费** — `turn()` 每跑完一步都检查 `inbox.nextStep`：

   - 为空 → 回合结束（结束前先广播 `agent/turn-stopping`，监听者还能在最后关头补注入）；
   - 非空 → 回合**不结束**，`target = 'next-step'` 继续下一步。

   这正是「**不打断当前回合，只在下一步注入**」的机制来源：当前这一步照常流式跑完，steer 排在它的下一位。

4. **认领并变成真正的模型输入** — 下一步开始时 `preStep()` 调 `inbox.claim('next-step', …)`，把队列里**全部** pending 的 steer 一次性取出（多次 `/steer` 按 FIFO 顺序，互不覆盖），经 `agent/pre-step` 钩子后成为 `decision.messages`。`turn()` 先把这些消息作为 `user/message` 事件写进会话，再调 `step()` → `buildRequest()`：`request.messages = session.deriveMessages()` 包含这条刚写入的 user 消息，最后 `llm.stream(request)` 发起**真实的模型调用**——模型看到的输入里就有这条 steer 文本。

一句话总结：`/steer 文本` = 往 agent 的持久化 inbox 排一条 user 消息并唤醒；回合循环在下一步边界认领它、把它写进会话、放进下一次 `llm.stream()` 的 messages 里。整个过程中当前回合的流式输出不会被打断。注入的文本是一条真实可见的 user 消息（会出现在会话里），不是隐藏的系统注入。

## 怎么用

1. 打开会话窗口，等输入框能打字。
2. 输入 `/steer`，空格后面写你要模型下一步听到的话，例如：

   ```text
   /steer 先不要改代码，只列出将要改的文件
   ```

3. 发送。输入框里的 `/steer` 这一行**不会**当成普通用户消息交给模型；真正注入的是斜杠后面的内容。
4. 成功时会话里会出现一条命令结果，说明是「已排队」还是「即将开始下一步」。失败时会说明原因，当前对话仍继续。

快捷写法：

```text
/skill
/docs
/new
```

`/skill`、`/docs` 也可以在后面再写一句补充。不要用它们来停止模型。要停止，请用界面上的停止按钮。

## 安装

先有可用的 `dsh`（Web profile），然后：

```sh
dsh plugin --profile web add deepseek-harness-ultra-slash
```

如果以前装过旧包名 `dsh-steer`，请先卸掉再装新名字，避免两套同时加载：

```sh
dsh plugin --profile web remove dsh-steer
dsh plugin --profile web add deepseek-harness-ultra-slash
```

本地开发（本仓库）：

```sh
bash devops/setup.sh    # 安装 mise 管理的 Node / pnpm 和依赖
bash devops/test.sh     # 类型检查 + 测试
bash devops/dev.sh      # 构建、装进 web profile、启动 http://127.0.0.1:3080
```

`devops/dev.sh` 会自动卸掉 web profile 里残留的 `dsh-steer`。改完代码再执行一次。只构建不启动用 `bash devops/build.sh`。

仓库根目录可以放 `deepseek-harness` 软链，方便对照源码；软链已写入 `.gitignore`，不要提交。若要用这份源码当 `dsh`：

```sh
ln -s ../deepseek-harness ./deepseek-harness
bash devops/build-harness.sh
bash devops/dev.sh
```

## 工程结构

```text
src/           插件源码（Host 半边注册斜杠命令；浏览器半边把插件命令单独列在斜杠菜单里）
tests/         单元测试
devops/        一键安装 / 构建 / 调试 / 发布
cordis.patch.yml   写入 DSH profile 的插件行
lib/index.js   Host 构建产物
lib/client.js  浏览器半边（斜杠菜单分组）
```

Host 负责真正执行 `/steer`、`/skill`、`/docs` 和自定义别名。浏览器半边负责 `/` 菜单分组、`/new` 切会话，以及设置页。

## 许可证

MIT
