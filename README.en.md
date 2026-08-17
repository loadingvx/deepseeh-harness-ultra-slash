# deepseek-harness-ultra-slash

[English](README.en.md) | [中文](README.md)

**Ultra Slash** for DeepSeek Harness: a separate `/` menu group for this plugin's commands.

![screen](docs/imgs/screen_shot_zh.png)
![screen](docs/imgs/screen_shot_config.png)

Built-in commands:

| Command | What it does | Interrupts the turn? |
| --- | --- | --- |
| `/steer text` | Injects text on the agent's **next model step** | No |
| `/new` | Starts a blank session (same as the sidebar New session button) | A running turn is **not** stopped; switch back from the sidebar |
| `/skill` | `/steer` with “save the solution as a project skill when done” | No |
| `/docs` | `/steer` with “write the cause and fix to docs/ as markdown when done” | No |

Custom `/name` aliases of `/steer` can be added under **Settings → Ultra Slash**.

## Behavior

Typing `/` opens the command menu. This plugin's commands sit in the bottom **Ultra Slash** group (Chinese UI: 插件命令), below built-in commands such as `/help` and `/plan`, with a divider between the groups.

`/steer`, `/skill`, `/docs`, and custom commands use the existing `agent.steer()` inbox: the current step keeps running, and the text is consumed the next time the agent talks to the model.

| Agent state | After `/steer don't edit yet` |
| --- | --- |
| Thinking / calling tools | The live turn is not cancelled. The text is injected on the next model access. |
| Idle | A new step starts immediately and carries the text. |
| `/steer` with no payload | Nothing is injected. The command card explains how to write it. |

`/skill` and `/docs` accept an optional extra suffix, appended to the fixed payload. Repeated calls queue independently.

## Custom commands

Open **Settings → Ultra Slash**, fill in a name (without the slash), optional menu description, and the guidance text, then click Add. The command is available immediately. The list is stored at `$DSH_HOME/ultra-slash/commands.json` and shared by every session.

## How `/steer` reaches the next model call

`/steer` is not a UI-only illusion. It drives the real `agent.steer()` channel that ships with Harness, and every step below maps to source in the `deepseek-harness` checkout.

1. **Command registration (Host half)** — `src/index.ts` registers the `steer` command through `ctx.commands.register({ name: 'steer', ... })`. On `/steer text`, the handler `executeSteer()` validates the input, builds one `role: 'user'` message (`src/message.ts`), and calls `invocation.agent.steer(message)`.

2. **Harness `Agent.steer()`** — `packages/core/agent-loop/src/agent.ts`:

   ```ts
   steer(input) { this.send(input, 'next-step', true) }   // queue to next-step, then wake
   ```

   `send()` splices the message into the Inbox `next-step` list (`inbox.splice('next-step', …)`) and durably records an `agent/inbox/spliced` session event — the queue survives replay, it is not transient memory. If the agent is idle, `wakeDriver()` starts a new turn right away; if it is running, the message simply waits in the queue and interrupts nothing.

3. **The turn loop consumes at step boundaries** — after every step, `turn()` checks `inbox.nextStep`:

   - empty → the turn ends (after broadcasting `agent/turn-stopping`, so listeners can still inject in the closing window);
   - non-empty → the turn does **not** end; `target = 'next-step'` and it runs another step.

   This is exactly why the live turn is not interrupted: the current step streams to completion and the steer is its successor.

4. **Claimed and turned into real model input** — the next `preStep()` calls `inbox.claim('next-step', …)`, draining the whole pending batch in FIFO order (repeated `/steer` calls queue without overwriting), then `decision.messages` after the `agent/pre-step` hook. `turn()` appends those messages to the session as `user/message` events and calls `step()` → `buildRequest()`: `request.messages = session.deriveMessages()` includes the fresh user message, and `llm.stream(request)` makes the actual model call — the model's input contains the steer text.

In one sentence: `/steer text` queues a user message into the agent's durable inbox and wakes it; the turn loop claims it at the next step boundary, writes it into the session, and puts it in the `messages` of the next `llm.stream()` call — without interrupting the current step's streaming. The injected text is a real, visible user-role message in the conversation, not a hidden system injection.

## Usage

```text
/steer don't edit files yet; list the files you would change
```

The `/steer` line stays in the human command plane. Only the suffix is queued as a user-role next-step message.

## Install

### Prerequisites

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) is installed, and `dsh web` can be started.

### From npm

1. Install the plugin (pin the version; do not omit `@0.2.0`):

```sh
dsh plugin --profile web add deepseek-harness-ultra-slash@0.2.0
```

`dsh plugin add` is implemented with pnpm. pnpm 11 waits **24 hours** after a version is published before it will pick it as `latest`. A bare `deepseek-harness-ultra-slash` (no `@version`) can therefore install an older release and still exit 0. Pinning `@0.2.0` requests that release explicitly.

If a pinned install is still refused as too new, add this to `~/.dsh/profiles/web/pnpm-workspace.yaml` and run the command again:

```yaml
minimumReleaseAgeExclude:
  - deepseek-harness-ultra-slash
```

2. Restart `dsh web`.

If the old package `dsh-steer` is still installed, remove it first so both copies are not loaded:

```sh
dsh plugin --profile web remove dsh-steer
dsh plugin --profile web add deepseek-harness-ultra-slash@0.2.0
```

### App market / GitHub

The market command installs the GitHub tree, not the npm tarball:

```sh
dsh plugin --profile web add github:loadingvx/deepseeh-harness-ultra-slash
```

This only works when the default branch already contains built `lib/index.js` and `lib/client.js`. A source-only commit will fail: pnpm blocks the git-hosted `prepare` script unless the user adds `allowBuilds`. After install, restart `dsh web`.

### Local development

```sh
bash devops/setup.sh
bash devops/test.sh
bash devops/dev.sh
```

`devops/dev.sh` removes a leftover `dsh-steer` entry from the web profile.

## License

MIT
