# deepseek-harness-ultra-slash

[English](README.en.md) | 中文

![screen](docs/imgs/screen_shot_zh.png)
![screen](docs/imgs/screen_shot_config.png)

DeepSeek Harness 的 **Ultra Slash** 插件：在会话输入框的 `/` 菜单里单独一组「插件命令」，和 DSH 自带命令分开。

## 功能

| 命令 | 做什么 |
| --- | --- |
| `/steer 内容` | 把内容交给模型的**下一步**，不打断当前对话 |
| `/new` | 开启空白会话 |
| `/skill` | `/steer` +「完成后把方案存成当前项目的 skill」 |
| `/docs` | `/steer` +「完成后把原因和方案写成 docs 里的 md」 |

还可以在 **设置 → 插件命令** 里给常用的 `/steer` 内容起短名字，例如 `/review`。

## 安装

需要已安装 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)，并能启动 `dsh web`。

### 从 npm 安装

```sh
dsh plugin --profile web add deepseek-harness-ultra-slash@0.2.1
```

`@0.2.1` 不能省略：pnpm 对刚发布的版本有 24 小时保护，不带版本号可能装到旧版。

### 从 GitHub 安装

```sh
dsh plugin --profile web add github:loadingvx/deepseeh-harness-ultra-slash
```

## 许可证

MIT
