import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
//#region src/message.ts
/** Build one user-role next-step message. Shape matches DSH `createUserMessage`. */
function createSteerMessage(text) {
	const message = {
		id: crypto.randomUUID(),
		role: "user",
		content: [{
			type: "text",
			text
		}],
		source: { kind: "user" }
	};
	return Object.freeze(message);
}
//#endregion
//#region src/locales.ts
/** Simplified Chinese dictionary (the key-set source of truth). */
const zh = {
	"menu.group": "插件命令",
	"steer.description": "不打断当前对话，把内容注入到模型下一步",
	"steer.hint": "<引导内容>",
	"steer.usage": "用法：/steer <引导内容>",
	"steer.example": "示例：/steer 先不要改代码，只列出将要改的文件",
	"steer.empty": "请写明要告诉模型的内容，然后再发送。\n{usage}\n{example}\n\n这条命令不会停止当前对话：模型正在跑时，内容会在下一次访问大模型时注入；模型空闲时，会立刻开始下一步。",
	"steer.queued.running": "已排队到下一步，当前对话不会被打断、也不需要点停止。\n模型下一次访问大模型时会看到：\n{quoted}",
	"steer.queued.idle": "已提交引导，即将开始下一步。\n模型会看到：\n{quoted}",
	"steer.cancelled": "引导已取消，没有注入给模型。",
	"steer.failed": "引导没有送出：{detail}\n当前对话没有被打断。可以改写内容后重新执行 /steer。",
	"steer.preview": "{preview}…\n（已完整排队，共 {count} 字；上面只是预览）",
	"steer.unknownError": "未知错误",
	"new.description": "开启新会话；后面跟的内容会作为第一句话直接发出",
	"new.hint": "<第一句话，可空>",
	"new.ok": "已切到空白会话。之前正在跑的对话不会被停止，可在左侧列表里点回去。",
	"new.started": "已创建新会话，正在发送你的输入：\n{quoted}",
	"new.unavailable": "现在还不能从这里开新会话。请点左侧栏的「新会话」按钮。",
	"alias.hint": "<补充说明，可空>",
	"skill.description": "完成后把刚才的方案存成当前项目的 skill，不打断对话",
	"skill.payload": "完成任务后将刚才的方案创建保存为当前项目下的skill备用",
	"docs.description": "完成后把问题原因和解决方案写成 md，放到 docs 目录，不打断对话",
	"docs.payload": "完成任务后将问题原因和解决方案输出为md文档写入到docs目录下",
	"catalog.issue.name.empty": "请填写命令名。不用写斜杠，填 review 就会变成 /review。",
	"catalog.issue.name.invalid": "命令名 /{name} 不合规。请用小写英文字母开头，后面只能是字母、数字、连字符或下划线。例如 review、save-note。中文请写在下面的「注入内容」里。",
	"catalog.issue.name.tooLong": "命令名太长（最多 {max} 个字符）。请缩短后再试。",
	"catalog.issue.name.reserved": "/{name} 是内置或系统命令，不能占用。请换一个名字，例如 my-{name}。",
	"catalog.issue.name.taken": "已经有 /{name} 了。请换个名字，或者先删掉原来的再添加。",
	"catalog.issue.description.tooLong": "说明太长（最多 {max} 个字）。请缩短后再试。",
	"catalog.issue.text.empty": "请填写发送后要告诉模型的内容。这条命令不会打断当前对话，效果和 /steer 一样。",
	"catalog.issue.text.tooLong": "注入内容太长（最多 {max} 个字）。请缩短后再试。",
	"catalog.issue.tooMany": "最多 {max} 条自定义命令。请先删掉不用的，再添加新的。",
	"catalog.issue.list.duplicate": "列表里出现了两个 /{name}。每个名字只能有一条。",
	"catalog.issue.occupied": "命令名 /{name} 已经被 DeepSeek Harness 占用，请换一个名字。",
	"catalog.issue.corrupt": "自定义命令配置文件损坏，没有覆盖保存。请检查 {path}，修好或删掉后再试。",
	"catalog.issue.io": "没能读写配置文件：{detail}。请确认 DeepSeek Harness 对 {path} 有写权限。",
	"catalog.issue.network": "没保存成功：连不上 DeepSeek Harness。请确认网页还开着，然后重试。",
	"catalog.issue.unknown": "没保存成功：{detail}",
	"settings.nav": "插件命令",
	"settings.title": "插件命令",
	"settings.intro": "在这里管理斜杠命令。它们会出现在输入框 / 菜单最下面的「插件命令」分组。自定义命令发送后，会把固定内容注入模型下一步，当前对话不会被打断。所有会话共用这份名单，保存在本机。",
	"settings.builtinTitle": "内置命令",
	"settings.builtinHint": "这四条不能改名或删除。/steer 是基础能力；另外三条是快捷写法。",
	"settings.customTitle": "自定义命令",
	"settings.customHint": "给常用的 /steer 内容起一个短名字。例如填 review，之后输入 /review 就等于发送那段固定内容。",
	"settings.empty": "还没有自定义命令。下面填好名字和要注入的内容，点「添加」。",
	"settings.nameLabel": "命令名",
	"settings.nameHint": "不用写斜杠。只能用小写英文字母、数字、连字符、下划线。",
	"settings.namePreview": "发送时输入 {slash}",
	"settings.descriptionLabel": "菜单说明（可选）",
	"settings.descriptionHint": "出现在 / 菜单这一行的右边。不填的话，会用注入内容的前几句。",
	"settings.textLabel": "注入内容",
	"settings.textHint": "发送这条命令后，模型下一步会看到这些文字。不会停止当前对话。",
	"settings.textPlaceholder": "例如：完成当前改动后，只总结测试结果，不要再改代码",
	"settings.add": "添加命令",
	"settings.adding": "正在添加…",
	"settings.save": "保存",
	"settings.saving": "正在保存…",
	"settings.cancel": "取消",
	"settings.edit": "编辑",
	"settings.delete": "删除",
	"settings.deleteConfirm": "确定删除 {slash}？删除后输入这个命令不会再生效。",
	"settings.deleteYes": "确定删除",
	"settings.added": "已添加 {slash}。现在就可以在输入框输入这个命令，当前对话不会被打断。",
	"settings.saved": "已保存 {slash}。",
	"settings.deleted": "已删除 {slash}。",
	"settings.loadFailed": "自定义命令名单加载失败。",
	"settings.retry": "重新加载",
	"settings.loading": "正在加载自定义命令…",
	"settings.maxReached": "已经有 {max} 条自定义命令。先删掉不用的，才能再添加。",
	"settings.rowKindSteer": "基础",
	"settings.rowKindAlias": "快捷",
	"settings.rowKindSession": "会话",
	"settings.rowKindCustom": "自定义",
	"defaults.title": "默认内容",
	"defaults.hint": "给内置命令设置默认文字。/steer 固定为手动输入，不能设置。/new 的默认文字会作为新会话的第一句话发出；/skill 和 /docs 的默认文字会注入模型下一步，使用时在命令后追加的文字会接在后面。留空则使用内置文案。",
	"defaults.save": "保存默认内容",
	"defaults.saving": "正在保存…",
	"defaults.saved": "默认内容已保存。",
	"defaults.labelNew": "新会话的第一句话",
	"defaults.labelSkill": "skill 注入内容",
	"defaults.labelDocs": "docs 注入内容",
	"defaults.placeholderNew": "例如：先总结当前工作区的改动",
	"defaults.placeholder": "例如：完成任务后，把关键步骤记录下来",
	"defaults.fallback": "未设置：使用内置文案",
	"defaults.steerManual": "/steer 直接手动输入，没有可预设的默认内容"
};
/** English dictionary, checked complete against the zh key set. */
const en = {
	"menu.group": "Ultra Slash",
	"steer.description": "Inject guidance into the next model step without interrupting the turn",
	"steer.hint": "<guidance>",
	"steer.usage": "Usage: /steer <guidance>",
	"steer.example": "Example: /steer list the files you would change, do not edit yet",
	"steer.empty": "Write the guidance for the model, then send.\n{usage}\n{example}\n\nThis command does not stop the current turn: while the model is running, the text is injected on the next model access; if it is idle, the next step starts immediately.",
	"steer.queued.running": "Queued for the next step. The current turn is not interrupted and you do not need to press Stop.\nThe model will see this on the next model access:\n{quoted}",
	"steer.queued.idle": "Guidance submitted. The next step will start now.\nThe model will see:\n{quoted}",
	"steer.cancelled": "Guidance cancelled. Nothing was injected.",
	"steer.failed": "Guidance was not sent: {detail}\nThe current turn was not interrupted. You can edit the text and run /steer again.",
	"steer.preview": "{preview}…\n(Queued in full, {count} characters; preview only above)",
	"steer.unknownError": "Unknown error",
	"new.description": "Start a new session; text after the command is sent as the first message",
	"new.hint": "<first message, optional>",
	"new.ok": "Switched to a blank session. A running turn was not stopped; you can switch back from the sidebar.",
	"new.started": "Created a new session; sending your input now:\n{quoted}",
	"new.unavailable": "A new session cannot be started from here. Use the New session button in the sidebar.",
	"alias.hint": "<optional extra>",
	"skill.description": "After the task, save the solution as a project skill, without interrupting the turn",
	"skill.payload": "After you finish this task, create and save the solution you just used as a skill in the current project for later reuse",
	"docs.description": "After the task, write the cause and fix to docs/ as markdown, without interrupting the turn",
	"docs.payload": "After you finish this task, write the root cause and the solution as a markdown document under the docs directory",
	"catalog.issue.name.empty": "Enter a command name. Do not type the slash — review becomes /review.",
	"catalog.issue.name.invalid": "/{name} is not a valid command name. Start with a lowercase letter; after that only letters, digits, hyphens, or underscores. Example: review, save-note. Put other languages in the guidance text, not the name.",
	"catalog.issue.name.tooLong": "The name is too long (max {max} characters). Shorten it and try again.",
	"catalog.issue.name.reserved": "/{name} is a built-in or system command. Pick another name, for example my-{name}.",
	"catalog.issue.name.taken": "/{name} already exists. Choose another name, or delete the existing one first.",
	"catalog.issue.description.tooLong": "The description is too long (max {max} characters). Shorten it and try again.",
	"catalog.issue.text.empty": "Write the text the model should see. This command does not interrupt the turn; it works like /steer.",
	"catalog.issue.text.tooLong": "The guidance is too long (max {max} characters). Shorten it and try again.",
	"catalog.issue.tooMany": "You can have at most {max} custom commands. Delete one you do not need, then add a new one.",
	"catalog.issue.list.duplicate": "The list contains two /{name} rows. Each name can appear only once.",
	"catalog.issue.occupied": "/{name} is already used by DeepSeek Harness. Pick another name.",
	"catalog.issue.corrupt": "The custom-command file is damaged and was not overwritten. Check {path}, fix or delete it, then try again.",
	"catalog.issue.io": "Could not read or write the config file: {detail}. Make sure DeepSeek Harness can write {path}.",
	"catalog.issue.network": "Save failed: DeepSeek Harness is not reachable. Keep the web UI open and try again.",
	"catalog.issue.unknown": "Save failed: {detail}",
	"settings.nav": "Ultra Slash",
	"settings.title": "Ultra Slash",
	"settings.intro": "Manage slash commands here. They appear in the bottom Ultra Slash group of the / menu. A custom command injects fixed text into the next model step and does not interrupt the current turn. The list is stored on this machine and shared by every session.",
	"settings.builtinTitle": "Built-in commands",
	"settings.builtinHint": "These four cannot be renamed or deleted. /steer is the primitive; the others are shortcuts.",
	"settings.customTitle": "Custom commands",
	"settings.customHint": "Give a short name to a /steer payload you use often. For example, review makes /review send that fixed text.",
	"settings.empty": "No custom commands yet. Fill in a name and the text to inject, then click Add.",
	"settings.nameLabel": "Command name",
	"settings.nameHint": "Do not type the slash. Use lowercase letters, digits, hyphens, and underscores only.",
	"settings.namePreview": "Type {slash} to send",
	"settings.descriptionLabel": "Menu description (optional)",
	"settings.descriptionHint": "Shown on the right of the / menu row. If empty, a preview of the guidance is used.",
	"settings.textLabel": "Guidance to inject",
	"settings.textHint": "After you send this command, the model sees this text on the next step. The current turn is not stopped.",
	"settings.textPlaceholder": "Example: after the current change, only summarize test results; do not edit more code",
	"settings.add": "Add command",
	"settings.adding": "Adding…",
	"settings.save": "Save",
	"settings.saving": "Saving…",
	"settings.cancel": "Cancel",
	"settings.edit": "Edit",
	"settings.delete": "Delete",
	"settings.deleteConfirm": "Delete {slash}? Typing this command will no longer do anything.",
	"settings.deleteYes": "Delete",
	"settings.added": "Added {slash}. You can type it in the composer now. The current turn is not interrupted.",
	"settings.saved": "Saved {slash}.",
	"settings.deleted": "Deleted {slash}.",
	"settings.loadFailed": "Could not load custom commands.",
	"settings.retry": "Retry",
	"settings.loading": "Loading custom commands…",
	"settings.maxReached": "You already have {max} custom commands. Delete one before adding another.",
	"settings.rowKindSteer": "Core",
	"settings.rowKindAlias": "Shortcut",
	"settings.rowKindSession": "Session",
	"settings.rowKindCustom": "Custom",
	"defaults.title": "Default prompts",
	"defaults.hint": "Set the default prompt for each built-in command. /steer stays manual and cannot be configured. The /new default is sent as the first message of the new session; the /skill and /docs defaults are injected into the next model step, and any text you type after the command is appended. Leave empty to use the built-in text.",
	"defaults.save": "Save defaults",
	"defaults.saving": "Saving…",
	"defaults.saved": "Defaults saved.",
	"defaults.labelNew": "First message of a new session",
	"defaults.labelSkill": "skill guidance",
	"defaults.labelDocs": "docs guidance",
	"defaults.placeholderNew": "Example: first summarize the current workspace changes",
	"defaults.placeholder": "Example: after the task, record the key steps",
	"defaults.fallback": "Not set: uses the built-in text",
	"defaults.steerManual": "/steer is manual input — there is no default to configure"
};
const DICTS = {
	zh,
	en
};
/** Fill `{name}` placeholders. Unknown names stay in the template. */
function interpolate(template, vars) {
	if (vars === void 0) return template;
	return template.replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(vars, name) ? String(vars[name]) : match);
}
/** Host-side lookup. Client menus should use `ctx.locale.bind(LOCALE_NS)` instead. */
function translate(locale, key, vars) {
	return interpolate(DICTS[locale][key], vars);
}
/** Settings `locale.preference` when present; otherwise DSH's zh fallback. */
function resolveHostLocale(get) {
	return (get?.("settings"))?.get?.("locale")?.preference === "en" ? "en" : "zh";
}
zh["menu.group"];
en["menu.group"];
const ISSUE_KEY = {
	"name.empty": "catalog.issue.name.empty",
	"name.invalid": "catalog.issue.name.invalid",
	"name.tooLong": "catalog.issue.name.tooLong",
	"name.reserved": "catalog.issue.name.reserved",
	"name.taken": "catalog.issue.name.taken",
	"description.tooLong": "catalog.issue.description.tooLong",
	"text.empty": "catalog.issue.text.empty",
	"text.tooLong": "catalog.issue.text.tooLong",
	tooMany: "catalog.issue.tooMany",
	"list.duplicate": "catalog.issue.list.duplicate"
};
/** User-facing text for a custom-command validation failure. */
function formatCatalogIssue(locale, issue) {
	const vars = {};
	if ("name" in issue) vars.name = issue.name;
	if ("max" in issue) vars.max = issue.max;
	return translate(locale, ISSUE_KEY[issue.code], vars);
}
//#endregion
//#region src/command.ts
const PLUGIN_NAME = "deepseek-harness-ultra-slash";
const COMMAND_NAME = "steer";
translate("en", "steer.description");
const COMMAND_HINT = translate("en", "steer.hint");
/** Split the command suffix. Surrounding whitespace is discarded; inner text is kept. */
function parseSteerInput(rawInput) {
	const text = rawInput.trim();
	if (text.length === 0) return { kind: "empty" };
	return {
		kind: "steer",
		text
	};
}
/** Usage error when the user typed `/steer` with nothing to inject. */
function emptySteerResult(locale = "zh") {
	return {
		kind: "error",
		text: translate(locale, "steer.empty", {
			usage: translate(locale, "steer.usage"),
			example: translate(locale, "steer.example")
		})
	};
}
/** Confirmation after the text has been queued. The injected payload is the full `text`. */
function queuedSteerResult(status, text, locale = "zh") {
	const quoted = quoteForNotice(text, locale);
	if (status === "running") return {
		kind: "success",
		text: translate(locale, "steer.queued.running", { quoted })
	};
	return {
		kind: "success",
		text: translate(locale, "steer.queued.idle", { quoted })
	};
}
/** Notice when the UI aborted the command before anything was queued. */
function cancelledSteerResult(locale = "zh") {
	return {
		kind: "error",
		text: translate(locale, "steer.cancelled")
	};
}
/** Notice when `agent.steer` itself throws. */
function steerFailedResult(error, locale = "zh") {
	return {
		kind: "error",
		text: translate(locale, "steer.failed", { detail: renderThrown(error, locale) })
	};
}
/** Host `/new` acknowledgment. The client actually switches the visible session. */
function newSessionResult(locale = "zh") {
	return {
		kind: "success",
		text: translate(locale, "new.ok")
	};
}
/** Validate, queue, and acknowledge one `/steer` line. Does not call `cancel()`. */
function executeSteer(invocation, locale = "zh") {
	if (invocation.signal.aborted) return cancelledSteerResult(locale);
	const parsed = parseSteerInput(invocation.rawInput);
	if (parsed.kind === "empty") return emptySteerResult(locale);
	try {
		invocation.agent.steer(createSteerMessage(parsed.text));
	} catch (error) {
		return steerFailedResult(error, locale);
	}
	return queuedSteerResult(invocation.agent.status, parsed.text, locale);
}
const NOTICE_PREVIEW_CHARS = 400;
/** Quote the queued text for the command card. Long payloads stay queued in full. */
function quoteForNotice(text, locale = "zh") {
	if (text.length <= NOTICE_PREVIEW_CHARS) return text;
	return translate(locale, "steer.preview", {
		preview: text.slice(0, NOTICE_PREVIEW_CHARS),
		count: text.length
	});
}
function renderThrown(error, locale) {
	if (error instanceof Error && error.message.trim().length > 0) return error.message;
	try {
		const text = String(error);
		return text.length > 0 ? text : translate(locale, "steer.unknownError");
	} catch {
		return translate(locale, "steer.unknownError");
	}
}
//#endregion
//#region src/http.ts
const HTTP_PREFIX = "/ultra-slash";
function send(res, status, body) {
	res.statusCode = status;
	res.setHeader("content-type", "application/json; charset=utf-8");
	res.setHeader("cache-control", "no-store");
	res.end(JSON.stringify(body));
}
function readBody(req) {
	return new Promise((resolve, reject) => {
		const chunks = [];
		let size = 0;
		req.on("data", (chunk) => {
			size += chunk.length;
			if (size > 1e6) {
				reject(/* @__PURE__ */ new Error("body too large"));
				req.destroy();
				return;
			}
			chunks.push(chunk);
		});
		req.on("end", () => {
			resolve(Buffer.concat(chunks).toString("utf8"));
		});
		req.on("error", reject);
	});
}
async function readJson(req) {
	const raw = await readBody(req);
	if (raw.trim() === "") return {};
	const parsed = JSON.parse(raw);
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("invalid json");
	return parsed;
}
function asCommandRows(value) {
	if (!Array.isArray(value)) return void 0;
	const rows = [];
	for (const item of value) {
		if (typeof item !== "object" || item === null) return void 0;
		const row = item;
		if (typeof row.name !== "string" || typeof row.steerText !== "string") return void 0;
		rows.push({
			name: row.name,
			steerText: row.steerText,
			...typeof row.description === "string" ? { description: row.description } : {}
		});
	}
	return rows;
}
function asDefaults(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
	return value;
}
async function handleUltraSlashRequest(req, res, hub) {
	const host = req.headers.host ?? "127.0.0.1";
	const route = new URL(req.url ?? "/ultra-slash", "http://" + host).pathname.replace(/\/+$/, "") || "/ultra-slash";
	const method = (req.method ?? "GET").toUpperCase();
	if (method === "OPTIONS") {
		res.statusCode = 204;
		res.end();
		return;
	}
	try {
		if (method === "GET" && route === "/ultra-slash/commands") {
			send(res, 200, {
				ok: true,
				value: {
					commands: hub.listCustom(),
					defaults: hub.defaults(),
					...hub.loadError() === void 0 ? {} : { warning: hub.loadError() }
				}
			});
			return;
		}
		if (method === "PUT" && route === "/ultra-slash/commands") {
			const body = await readJson(req);
			if (body.commands !== void 0) {
				const rows = asCommandRows(body.commands);
				if (rows === void 0) {
					send(res, 400, {
						ok: false,
						message: "请求格式不对。需要 { \"commands\": [ { \"name\", \"steerText\", \"description?\" } ] }。"
					});
					return;
				}
				const result = await hub.saveCustom(rows);
				if (!result.ok) {
					send(res, 400, result);
					return;
				}
			}
			if (body.defaults !== void 0) {
				const defaults = asDefaults(body.defaults);
				if (defaults === void 0) {
					send(res, 400, {
						ok: false,
						message: "请求格式不对。defaults 需要是对象。"
					});
					return;
				}
				const result = await hub.saveDefaults(defaults);
				if (!result.ok) {
					send(res, 400, result);
					return;
				}
			}
			send(res, 200, {
				ok: true,
				value: {
					commands: hub.listCustom(),
					defaults: hub.defaults()
				}
			});
			return;
		}
		send(res, 404, {
			ok: false,
			message: "没有这个接口。"
		});
	} catch (error) {
		send(res, 400, {
			ok: false,
			message: error instanceof Error ? error.message : String(error)
		});
	}
}
function registerUltraSlashHttp(server, hub) {
	return server.register({
		kind: "prefix",
		path: HTTP_PREFIX,
		handler: (req, res) => {
			handleUltraSlashRequest(req, res, hub);
		}
	});
}
//#endregion
//#region src/catalog.ts
/** DSH command names: lowercase letter, then letters / digits / _ / -. */
const COMMAND_NAME_PATTERN = /^[a-z][a-z0-9_-]*$/u;
const MAX_STEER_TEXT_LENGTH = 8e3;
/** Builtin commands whose default prompt the user may configure (everything except the steer primitive). */
const CONFIGURABLE_DEFAULT_NAMES = [
	"new",
	"skill",
	"docs"
];
/**
* Shipped commands, in menu order. `/steer` is the primitive; `/skill` and
* `/docs` are fixed-text aliases of it; `/new` opens a blank session on the client.
*/
const BUILTIN_SLASH_COMMANDS = [
	{
		name: "steer",
		kind: "steer",
		descriptionKey: "steer.description",
		hintKey: "steer.hint"
	},
	{
		name: "new",
		kind: "session",
		descriptionKey: "new.description"
	},
	{
		name: "skill",
		kind: "alias",
		descriptionKey: "skill.description",
		hintKey: "alias.hint",
		payloadKey: "skill.payload"
	},
	{
		name: "docs",
		kind: "alias",
		descriptionKey: "docs.description",
		hintKey: "alias.hint",
		payloadKey: "docs.payload"
	}
];
const BUILTIN_SLASH_NAMES = new Set(BUILTIN_SLASH_COMMANDS.map((command) => command.name));
/**
* Well-known DSH command names we refuse to shadow. A collision with a
* command that is actually registered is still caught at `commands.register`.
*/
const DSH_RESERVED_NAMES = /* @__PURE__ */ new Set([
	"help",
	"plan",
	"goal",
	"compact",
	"feedback",
	"export",
	"permission",
	"model",
	"theme",
	"clear",
	"status",
	"commands",
	"resume",
	"fork"
]);
const RESERVED_SLASH_NAMES = /* @__PURE__ */ new Set([...BUILTIN_SLASH_NAMES, ...DSH_RESERVED_NAMES]);
/** Strip a leading `/` and lowercase so "Review" / "/review" become `review`. */
function normalizeCommandName(raw) {
	return raw.trim().replace(/^\//, "").toLowerCase();
}
function trimDescription(raw) {
	return raw.trim().slice(0, 80);
}
function defaultDescription(steerText) {
	const text = steerText.trim().replace(/\s+/g, " ");
	if (text.length <= 80) return text;
	return `${text.slice(0, 79)}…`;
}
/**
* Validate one custom command. `taken` is other names already in the list
* (not including this row's current name when renaming).
*/
function validateCustomCommand(input, taken = /* @__PURE__ */ new Set()) {
	const name = normalizeCommandName(input.name);
	if (name.length === 0) return {
		ok: false,
		issue: { code: "name.empty" }
	};
	if (name.length > 32) return {
		ok: false,
		issue: {
			code: "name.tooLong",
			name,
			max: 32
		}
	};
	if (!COMMAND_NAME_PATTERN.test(name)) return {
		ok: false,
		issue: {
			code: "name.invalid",
			name
		}
	};
	if (RESERVED_SLASH_NAMES.has(name)) return {
		ok: false,
		issue: {
			code: "name.reserved",
			name
		}
	};
	if (taken.has(name)) return {
		ok: false,
		issue: {
			code: "name.taken",
			name
		}
	};
	const description = trimDescription(input.description ?? "");
	if ((input.description ?? "").trim().length > 80) return {
		ok: false,
		issue: {
			code: "description.tooLong",
			max: 80
		}
	};
	const steerText = input.steerText.trim();
	if (steerText.length === 0) return {
		ok: false,
		issue: { code: "text.empty" }
	};
	if (steerText.length > 8e3) return {
		ok: false,
		issue: {
			code: "text.tooLong",
			max: MAX_STEER_TEXT_LENGTH
		}
	};
	return {
		ok: true,
		command: {
			name,
			description: description.length > 0 ? description : defaultDescription(steerText),
			steerText
		}
	};
}
/** Validate a full replacement list. First error wins so the UI can point at one field. */
function validateCustomList(rows) {
	if (rows.length > 40) return {
		ok: false,
		issue: {
			code: "tooMany",
			max: 40
		}
	};
	const commands = [];
	const seen = /* @__PURE__ */ new Set();
	for (const row of rows) {
		const result = validateCustomCommand(row, seen);
		if (!result.ok) {
			if (result.issue.code === "name.taken") return {
				ok: false,
				issue: {
					code: "list.duplicate",
					name: result.issue.name
				}
			};
			return result;
		}
		seen.add(result.command.name);
		commands.push(result.command);
	}
	return {
		ok: true,
		commands
	};
}
/** Join the builtin payload with an optional extra suffix from `/name extra`. */
function composeAliasText(template, rawInput) {
	const extra = rawInput.trim();
	if (extra.length === 0) return template;
	return `${template}
${extra}`;
}
/**
* Normalize a raw defaults object: keep only the configurable names, trim,
* and cap each value at {@link MAX_STEER_TEXT_LENGTH}. Empty strings are
* dropped so the shipped payload (or a blank session for /new) stays the fallback.
*/
function normalizeDefaults(raw) {
	if (raw === null || raw === void 0) return {};
	const out = {};
	for (const name of CONFIGURABLE_DEFAULT_NAMES) {
		const value = raw[name];
		if (typeof value !== "string") continue;
		const text = value.trim().slice(0, MAX_STEER_TEXT_LENGTH);
		if (text.length === 0) continue;
		out[name] = text;
	}
	return out;
}
const STORE_RELATIVE_DIR = "ultra-slash";
const STORE_FILE_NAME = "commands.json";
function resolveDshHome(env = process.env) {
	const fromEnv = env.DSH_HOME?.trim();
	if (fromEnv !== void 0 && fromEnv.length > 0) return fromEnv;
	return join(homedir(), ".dsh");
}
function customCommandStorePath(env = process.env) {
	return join(resolveDshHome(env), STORE_RELATIVE_DIR, STORE_FILE_NAME);
}
var StoreError = class extends Error {
	code;
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "StoreError";
	}
};
function isCommandShape(value) {
	if (typeof value !== "object" || value === null) return false;
	const row = value;
	return typeof row.name === "string" && typeof row.steerText === "string" && (row.description === void 0 || typeof row.description === "string");
}
function parseStoreFile(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (error) {
		throw new StoreError("corrupt", "commands.json is not valid JSON", { cause: error });
	}
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new StoreError("corrupt", "commands.json must be an object");
	const body = parsed;
	if (!Array.isArray(body.commands)) throw new StoreError("corrupt", "commands.json is missing a commands array");
	const rows = body.commands;
	if (!rows.every(isCommandShape)) throw new StoreError("corrupt", "commands.json contains an invalid command row");
	const validated = validateCustomList(rows);
	if (!validated.ok) throw new StoreError("corrupt", "commands.json failed validation: " + validated.issue.code);
	const defaults = normalizeDefaults(typeof body.defaults === "object" && body.defaults !== null && !Array.isArray(body.defaults) ? body.defaults : void 0);
	return {
		commands: validated.commands,
		defaults
	};
}
/** Parse the whole store file (custom commands + configured builtin defaults). */
async function loadUltraSlashStore(path) {
	let raw;
	try {
		raw = await readFile(path, "utf8");
	} catch (error) {
		if (isNotFound(error)) return {
			commands: [],
			defaults: {}
		};
		throw new StoreError("io", "could not read " + path, { cause: error });
	}
	if (raw.trim().length === 0) return {
		commands: [],
		defaults: {}
	};
	return parseStoreFile(raw);
}
async function saveCustomCommands(path, commands, defaults = {}) {
	const body = {
		version: 1,
		commands,
		...Object.keys(defaults).length > 0 ? { defaults } : {}
	};
	const json = JSON.stringify(body, null, 2) + "\n";
	const tmp = path + "." + process.pid + ".tmp";
	try {
		await mkdir(dirname(path), { recursive: true });
		await writeFile(tmp, json, "utf8");
		await rename(tmp, path);
	} catch (error) {
		throw new StoreError("io", "could not write " + path, { cause: error });
	}
}
function isNotFound(error) {
	return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
//#endregion
//#region src/register.ts
/**
* Host command registrations: builtins plus the user-defined `/steer` aliases
* persisted under `$DSH_HOME/ultra-slash/commands.json`.
*/
function localeOf(ctx) {
	return resolveHostLocale((name) => ctx.get(name));
}
function aliasHandler(ctx, template) {
	return (invocation) => executeSteer({
		...invocation,
		rawInput: composeAliasText(template(), invocation.rawInput)
	}, localeOf(ctx));
}
function isAlreadyRegistered(error) {
	return error instanceof Error && /already registered/i.test(error.message);
}
function nameFromRegisterError(error) {
	if (!(error instanceof Error)) return void 0;
	return /command "([^"]+)" is already registered/i.exec(error.message)?.[1];
}
function occupiedMessage(locale, name, error) {
	if (isAlreadyRegistered(error)) return translate(locale, "catalog.issue.occupied", { name });
	return translate(locale, "catalog.issue.unknown", { detail: error instanceof Error && error.message.trim().length > 0 ? error.message : translate(locale, "steer.unknownError") });
}
function storeMessage(locale, error, path) {
	if (error.code === "corrupt") return translate(locale, "catalog.issue.corrupt", { path });
	return translate(locale, "catalog.issue.io", {
		path,
		detail: error.cause instanceof Error ? error.cause.message : error.message
	});
}
function registerOne(ctx, definition) {
	return ctx.commands.register(definition);
}
const noticeSink = (conflict) => {
	const where = conflict.resource === "command" ? "command \"/" + conflict.name + "\"" : "HTTP prefix \"" + conflict.path + "\"";
	console.warn("[deepseek-harness-ultra-slash] " + where + " is already registered by another plugin (a leftover ultra-slash install, or dsh-workbench-plugin's embedded copy); this plugin stands down for it. No data is touched; the owner keeps serving the resource.");
};
let currentConflictSink = noticeSink;
function yieldConflict(conflict) {
	currentConflictSink(conflict);
}
/** Report a yielded HTTP-prefix conflict from the webServer registration. */
function yieldHttpPrefixConflict(path) {
	yieldConflict({
		resource: "http-prefix",
		path
	});
}
/** Builtins may already be owned by a leftover ultra-slash plugin; skip instead of crashing load. */
function registerBuiltinOne(ctx, definition) {
	try {
		return registerOne(ctx, definition);
	} catch (error) {
		if (isAlreadyRegistered(error)) {
			yieldConflict({
				resource: "command",
				name: nameFromRegisterError(error) ?? definition.name
			});
			return () => {};
		}
		throw error;
	}
}
/** A custom command may also be owned by the workbench's hub (same store file). */
function registerCustomRow(ctx, command) {
	try {
		return registerOne(ctx, {
			name: command.name,
			description: command.description,
			input: { hint: translate("en", "alias.hint") },
			handler: aliasHandler(ctx, () => command.steerText)
		});
	} catch (error) {
		if (isAlreadyRegistered(error)) {
			yieldConflict({
				resource: "command",
				name: command.name
			});
			return () => {};
		}
		throw error;
	}
}
/**
* Register shipped commands. /new only acknowledges; the client switches the
* session. /skill and /docs read their default prompt from readDefaults at
* invocation time (the persisted per-command default, falling back to the
* shipped locale payload) and append any extra text the user typed after the
* command token.
*/
function registerBuiltinCommands(ctx, readDefaults = () => ({})) {
	const undo = [];
	for (const command of BUILTIN_SLASH_COMMANDS) {
		if (command.kind === "steer") {
			undo.push(registerBuiltinOne(ctx, {
				name: COMMAND_NAME,
				description: translate("en", "steer.description"),
				input: { hint: COMMAND_HINT },
				handler: (invocation) => executeSteer(invocation, localeOf(ctx))
			}));
			continue;
		}
		if (command.kind === "session") {
			undo.push(registerBuiltinOne(ctx, {
				name: command.name,
				description: translate("en", "new.description"),
				handler: (invocation) => {
					if (invocation.signal.aborted) return cancelledSteerResult(localeOf(ctx));
					return newSessionResult(localeOf(ctx));
				}
			}));
			continue;
		}
		const payloadKey = command.payloadKey;
		if (payloadKey === void 0) continue;
		const name = command.name;
		undo.push(registerBuiltinOne(ctx, {
			name,
			description: translate("en", command.descriptionKey),
			input: { hint: translate("en", "alias.hint") },
			handler: aliasHandler(ctx, () => {
				const locale = localeOf(ctx);
				const configured = readDefaults()[name];
				return configured !== void 0 && configured.length > 0 ? configured : translate(locale, payloadKey);
			})
		}));
	}
	return () => {
		while (undo.length > 0) undo.pop()?.();
	};
}
/**
* Load persisted custom commands and builtin defaults, keep them registered,
* and replace the set when the settings page saves.
*/
function createCommandHub(ctx, storePath = customCommandStorePath()) {
	let custom = [];
	let builtinDefaults = {};
	let disposers = [];
	const replaceLive = (next) => {
		const previous = custom;
		while (disposers.length > 0) disposers.pop()?.();
		try {
			const nextDisposers = [];
			for (const command of next) nextDisposers.push(registerCustomRow(ctx, command));
			disposers = nextDisposers;
			custom = next;
		} catch (error) {
			while (disposers.length > 0) disposers.pop()?.();
			const restored = [];
			for (const command of previous) restored.push(registerCustomRow(ctx, command));
			disposers = restored;
			custom = previous;
			throw error;
		}
	};
	let queue = Promise.resolve();
	const persist = async () => {
		await saveCustomCommands(storePath, custom, builtinDefaults);
	};
	const persistError = (locale, error) => {
		return storeMessage(locale, error instanceof StoreError ? error : new StoreError("io", "write failed", { cause: error }), storePath);
	};
	const saveCustomUnlocked = async (rows) => {
		const locale = localeOf(ctx);
		const validated = validateCustomList(rows);
		if (!validated.ok) return {
			ok: false,
			message: formatCatalogIssue(locale, validated.issue)
		};
		const previous = custom;
		try {
			replaceLive(validated.commands);
		} catch (error) {
			return {
				ok: false,
				message: occupiedMessage(locale, nameFromRegisterError(error) ?? validated.commands[0]?.name ?? "", error)
			};
		}
		try {
			await persist();
		} catch (error) {
			replaceLive(previous);
			return {
				ok: false,
				message: persistError(locale, error)
			};
		}
		return {
			ok: true,
			commands: validated.commands
		};
	};
	const saveDefaultsUnlocked = async (raw) => {
		const locale = localeOf(ctx);
		const next = normalizeDefaults(raw);
		const previous = builtinDefaults;
		builtinDefaults = next;
		try {
			await persist();
		} catch (error) {
			builtinDefaults = previous;
			return {
				ok: false,
				message: persistError(locale, error)
			};
		}
		return {
			ok: true,
			defaults: next
		};
	};
	let bootError;
	return {
		listCustom: () => custom,
		defaults: () => builtinDefaults,
		loadError: () => bootError,
		setLoadError(message) {
			bootError = message;
		},
		saveCustom(rows) {
			const done = queue.then(async () => {
				const result = await saveCustomUnlocked(rows);
				if (result.ok) bootError = void 0;
				return result;
			});
			queue = done.then(() => void 0, () => void 0);
			return done;
		},
		saveDefaults(raw) {
			const done = queue.then(async () => {
				const result = await saveDefaultsUnlocked(raw);
				if (result.ok) bootError = void 0;
				return result;
			});
			queue = done.then(() => void 0, () => void 0);
			return done;
		}
	};
}
async function loadHubFromDisk(hub, storePath = customCommandStorePath()) {
	try {
		const { commands, defaults } = await loadUltraSlashStore(storePath);
		const customResult = await hub.saveCustom(commands);
		if (!customResult.ok) {
			hub.setLoadError(customResult.message);
			return customResult;
		}
		const defaultsResult = await hub.saveDefaults(defaults);
		if (!defaultsResult.ok) {
			hub.setLoadError(defaultsResult.message);
			return customResult;
		}
		return customResult;
	} catch (error) {
		const locale = "zh";
		const message = error instanceof StoreError ? storeMessage(locale, error, storePath) : translate(locale, "catalog.issue.unknown", { detail: error instanceof Error ? error.message : String(error) });
		hub.setLoadError(message);
		return {
			ok: false,
			message
		};
	}
}
/** Register shipped commands. Tests can call this without touching the store. */
function applyCommands(ctx, readDefaults = () => ({})) {
	registerBuiltinCommands(ctx, readDefaults);
}
//#endregion
//#region src/index.ts
const name = PLUGIN_NAME;
const inject = ["commands"];
/** The webServer route error when the same prefix is registered twice. */
function isDuplicateRoute(error) {
	return error instanceof Error && /duplicate (exact|prefix|upgrade) route/.test(error.message);
}
/**
* Register the settings JSON API, standing down when the prefix is already
* owned (workbench's embedded ultra-slash or a leftover install). The owner's
* handler serves the same shared store, so the settings page keeps working.
*/
function registerHttpTolerant(server, hub) {
	try {
		return registerUltraSlashHttp(server, hub);
	} catch (error) {
		if (isDuplicateRoute(error)) {
			yieldHttpPrefixConflict(HTTP_PREFIX);
			return () => {};
		}
		throw error;
	}
}
/** Register slash commands and, when the web server is present, the settings API. */
function apply(ctx) {
	const host = ctx;
	const hub = createCommandHub(host);
	applyCommands(host, () => hub.defaults());
	loadHubFromDisk(hub);
	const injectServices = ctx.inject;
	if (typeof injectServices !== "function") return;
	injectServices.call(ctx, ["webServer"], (host) => {
		host.effect(() => {
			const server = host.get("webServer");
			if (server === void 0 || typeof server.register !== "function") return () => {};
			return registerHttpTolerant(server, hub);
		}, `${PLUGIN_NAME}: http`);
	});
}
//#endregion
export { COMMAND_NAME, PLUGIN_NAME, apply, executeSteer, inject, name };
