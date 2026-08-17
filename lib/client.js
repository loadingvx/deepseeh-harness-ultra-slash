window.__ModuleLoader__.load({
	id: "deepseek-harness-ultra-slash",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/locales.ts
		/** Dictionary namespace registered with `ctx.locale.register`. */
		const LOCALE_NS = "ultra-slash";
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
			"new.description": "开启空白会话。正在跑的对话不会被停止，可在左侧点回去",
			"new.ok": "已切到空白会话。之前正在跑的对话不会被停止，可在左侧列表里点回去。",
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
			"settings.intro": "这里的斜杠命令会出现在输入框 / 菜单最下面的「插件命令」分组。自定义命令发送后，会把固定内容注入模型下一步，当前对话不会被打断。所有会话共用这份名单，保存在本机。",
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
			"settings.rowKindCustom": "自定义"
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
			"new.description": "Start a blank session. A running turn is not stopped; switch back from the sidebar",
			"new.ok": "Switched to a blank session. A running turn was not stopped; you can switch back from the sidebar.",
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
			"settings.intro": "These slash commands appear in the bottom Ultra Slash group of the / menu. A custom command injects fixed text into the next model step and does not interrupt the current turn. The list is stored on this machine and shared by every session.",
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
			"settings.rowKindCustom": "Custom"
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
		const SLASH_MENU_TITLE_ZH = zh["menu.group"];
		const SLASH_MENU_TITLE_EN = en["menu.group"];
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
		translate("en", "steer.description");
		translate("en", "steer.hint");
		//#endregion
		//#region src/catalog.ts
		/** DSH command names: lowercase letter, then letters / digits / _ / -. */
		const COMMAND_NAME_PATTERN = /^[a-z][a-z0-9_-]*$/u;
		const MAX_STEER_TEXT_LENGTH = 8e3;
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
		//#endregion
		//#region src/slash-menu.ts
		/**
		* Slash-menu grouping for this plugin's commands.
		*
		* DSH puts every `ctx.commands.register` row into one "命令" source and
		* fuzzy-ranks them together. Plugin commands stay in a separate source
		* (`ultra-slash`) so they keep their own order, with a divider above this
		* group when built-in commands sit first. The built-in source is filtered
		* so plugin names are not listed twice.
		*/
		/** Menu group id. Locale lookup falls back to this string if titles are not patched. */
		const PLUGIN_SLASH_SOURCE = "ultra-slash";
		/**
		* Divider on this group's title when another slash group is already above it.
		* `order` puts ultra-slash last; this only draws the line, it does not move rows.
		*/
		const PLUGIN_SLASH_DIVIDER_CSS = [
			`[role="presentation"][data-source] ~ [role="presentation"][data-source="${PLUGIN_SLASH_SOURCE}"]{`,
			"border-top:1px solid var(--dsw-alias-border-inverted, rgba(127,127,127,.35));",
			"margin-top:4px;",
			"padding-top:10px;",
			"}"
		].join("");
		/** Commands this plugin ships. Custom rows are appended at candidate time. */
		const PLUGIN_SLASH_COMMANDS = BUILTIN_SLASH_COMMANDS.map((command) => ({
			name: command.name,
			descriptionKey: command.descriptionKey,
			...command.hintKey === void 0 ? {} : { hintKey: command.hintKey }
		}));
		const PLUGIN_SLASH_NAMES = BUILTIN_SLASH_NAMES;
		function toSlashCandidate(command, t = (key) => zh[key] ?? key) {
			return {
				name: command.name,
				description: t(command.descriptionKey),
				hint: command.hintKey === void 0 ? "" : t(command.hintKey)
			};
		}
		function customToSlashCandidate(command, hint = "") {
			return {
				name: command.name,
				description: command.description,
				hint
			};
		}
		/**
		* Filter this plugin's commands independently of DSH fuzzy ranking.
		* Empty query keeps catalog order. A query keeps prefix matches first, then
		* substring matches, still in catalog order within each bucket.
		*/
		function filterPluginCommands(commands, query) {
			const needle = query.trim().toLowerCase();
			if (needle === "") return [...commands];
			const prefix = [];
			const rest = [];
			for (const command of commands) {
				const name = command.name.toLowerCase();
				if (name.startsWith(needle)) prefix.push(command);
				else if (name.includes(needle)) rest.push(command);
			}
			return [...prefix, ...rest];
		}
		function pluginSlashCandidates(query, leading, t = (key) => translate("zh", key), custom = []) {
			if (!leading) return [];
			const hint = t("alias.hint");
			return filterPluginCommands([...PLUGIN_SLASH_COMMANDS.map((command) => toSlashCandidate(command, t)), ...custom.map((command) => customToSlashCandidate(command, hint))], query);
		}
		const WRAPPED = Symbol.for("deepseek-harness-ultra-slash.command-source-wrapped");
		function isCommandSource(source) {
			return source.trigger === "/" && source.name === "command";
		}
		/**
		* Hide plugin command names from the built-in "命令" list so they only appear
		* in the ultra-slash group. Execution (`matchSpace` / `matchEnter` / `onPick`)
		* stays on the original source.
		*/
		function hidePluginNamesFromCommandSource(source, names = PLUGIN_SLASH_NAMES) {
			if (!isCommandSource(source)) return () => {};
			if (Reflect.get(source, WRAPPED) === true) return () => {};
			const original = source.candidates;
			source.candidates = async (session, req) => {
				return (await original.call(source, session, req)).filter((row) => !names.has(row.name));
			};
			Reflect.set(source, WRAPPED, true);
			return () => {
				source.candidates = original;
				Reflect.set(source, WRAPPED, false);
			};
		}
		/**
		* Wrap the live command source (already registered) and any later
		* `registerSource` of `command`, so plugin names stay out of DSH ranking.
		*/
		function installCommandSourceFilter(service, names = PLUGIN_SLASH_NAMES) {
			const undo = [];
			const wrap = (source) => {
				undo.push(hidePluginNamesFromCommandSource(source, names));
			};
			for (const source of service.live?.sources ?? []) wrap(source);
			const originalRegister = service.registerSource;
			service.registerSource = (source) => {
				wrap(source);
				return originalRegister.call(service, source);
			};
			return () => {
				service.registerSource = originalRegister;
				while (undo.length > 0) undo.pop()?.();
			};
		}
		function findCommandSource(service) {
			return (service.live?.sources ?? []).find((source) => isCommandSource(source));
		}
		/**
		* `slash.menu` is owned by DSH; a second `locale.register('slash.menu')` throws.
		* Write the group title onto the existing dictionaries instead.
		*/
		function patchSlashMenuGroupTitle(locale) {
			const write = () => {
				const table = locale.dicts?.get("slash.menu");
				if (table === void 0) return;
				const zh = table.get("zh");
				const en = table.get("en");
				if (zh !== void 0) zh[PLUGIN_SLASH_SOURCE] = SLASH_MENU_TITLE_ZH;
				if (en !== void 0) en[PLUGIN_SLASH_SOURCE] = SLASH_MENU_TITLE_EN;
			};
			write();
			const original = locale.register;
			locale.register = (ns, localeOrDicts, dict) => {
				const result = original.call(locale, ns, localeOrDicts, dict);
				if (ns === "slash.menu") write();
				return result;
			};
			return () => {
				locale.register = original;
				const table = locale.dicts?.get("slash.menu");
				if (table === void 0) return;
				const zh = table.get("zh");
				const en = table.get("en");
				if (zh !== void 0 && zh["ultra-slash"] === SLASH_MENU_TITLE_ZH) delete zh[PLUGIN_SLASH_SOURCE];
				if (en !== void 0 && en["ultra-slash"] === SLASH_MENU_TITLE_EN) delete en[PLUGIN_SLASH_SOURCE];
			};
		}
		//#endregion
		//#region src/client/catalog-api.ts
		const CUSTOM_COMMANDS_URL = "/ultra-slash/commands";
		function failMessage(error) {
			if (error instanceof Error && error.message.trim().length > 0) return translate("zh", "catalog.issue.unknown", { detail: error.message });
			return translate("zh", "catalog.issue.network");
		}
		async function readResult(response) {
			let data;
			try {
				data = await response.json();
			} catch {
				return {
					ok: false,
					message: translate("zh", "catalog.issue.network")
				};
			}
			if (typeof data !== "object" || data === null) return {
				ok: false,
				message: translate("zh", "catalog.issue.network")
			};
			const body = data;
			if (body.ok === true) {
				const rows = Array.isArray(body.value?.commands) ? body.value.commands : Array.isArray(body.commands) ? body.commands : [];
				const commands = [];
				for (const row of rows) {
					if (typeof row !== "object" || row === null) continue;
					const item = row;
					if (typeof item.name !== "string" || typeof item.steerText !== "string") continue;
					commands.push({
						name: item.name,
						steerText: item.steerText,
						description: typeof item.description === "string" ? item.description : item.steerText
					});
				}
				return {
					ok: true,
					commands,
					...typeof body.value?.warning === "string" ? { warning: body.value.warning } : {}
				};
			}
			return {
				ok: false,
				message: typeof body.message === "string" && body.message.trim().length > 0 ? body.message : translate("zh", "catalog.issue.network")
			};
		}
		async function fetchCustomCommands() {
			try {
				return await readResult(await fetch(CUSTOM_COMMANDS_URL, { headers: { accept: "application/json" } }));
			} catch (error) {
				return {
					ok: false,
					message: failMessage(error)
				};
			}
		}
		async function putCustomCommands(commands) {
			try {
				return await readResult(await fetch(CUSTOM_COMMANDS_URL, {
					method: "PUT",
					headers: {
						accept: "application/json",
						"content-type": "application/json"
					},
					body: JSON.stringify({ commands })
				}));
			} catch (error) {
				return {
					ok: false,
					message: failMessage(error)
				};
			}
		}
		/** In-memory custom-command list shared by the `/` menu and the settings page. */
		function createCatalogCache() {
			let commands = [];
			const listeners = /* @__PURE__ */ new Set();
			const notify = () => {
				for (const listener of listeners) listener();
			};
			return {
				list: () => commands,
				subscribe(listener) {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				},
				async refresh() {
					const result = await fetchCustomCommands();
					if (result.ok) {
						commands = [...result.commands];
						notify();
					}
					return result;
				},
				async save(next) {
					const result = await putCustomCommands(next);
					if (result.ok) {
						commands = [...result.commands];
						notify();
					}
					return result;
				}
			};
		}
		//#endregion
		//#region src/client/new-session.ts
		function leadingCommandName(line) {
			return /^\/([a-z][a-z0-9_-]*)(?=$|[\t\n\r ])/u.exec(line.trim())?.[1];
		}
		function startNewSession(get) {
			const workspaces = get("workspaces");
			if (workspaces === void 0 || typeof workspaces.startSession !== "function") return false;
			workspaces.startSession();
			return true;
		}
		function wrapCommandSource(source, start) {
			if (source.trigger !== "/" || source.name !== "command") return () => {};
			const originalOnPick = source.onPick;
			const originalMatchEnter = source.matchEnter;
			source.onPick = (pick) => {
				const outcome = originalOnPick.call(source, pick);
				if (pick?.candidate?.name === "new") start();
				return outcome;
			};
			if (originalMatchEnter !== void 0) source.matchEnter = async (session, line, signal) => {
				const outcome = await originalMatchEnter.call(source, session, line, signal);
				if (leadingCommandName(line) === "new" && outcome !== void 0) start();
				return outcome;
			};
			return () => {
				source.onPick = originalOnPick;
				source.matchEnter = originalMatchEnter;
			};
		}
		/**
		* After the host `/new` command is claimed, switch the visible session.
		* Does not cancel a running turn — same as the sidebar「新会话」button.
		*/
		function installNewSessionBridge(service, start) {
			const undo = [];
			const wrap = (source) => {
				undo.push(wrapCommandSource(source, start));
			};
			for (const source of service.live?.sources ?? []) wrap(source);
			const originalRegister = service.registerSource;
			service.registerSource = (source) => {
				wrap(source);
				return originalRegister.call(service, source);
			};
			return () => {
				service.registerSource = originalRegister;
				while (undo.length > 0) undo.pop()?.();
			};
		}
		//#endregion
		//#region \0dsh-css:/root/arch_workspace/dsh-steer/src/client/SettingsSection.module.css.mjs
		const css = ".T2mQUq_section{max-width:760px;color:var(--dsw-alias-label-primary,#1f2328);flex-direction:column;gap:20px;display:flex}.T2mQUq_heading{margin:0;font-size:18px;font-weight:600;line-height:1.4}.T2mQUq_intro{color:var(--dsw-alias-label-tertiary,#8b93a1);margin:0;font-size:13px;line-height:1.6}.T2mQUq_block{flex-direction:column;gap:10px;display:flex}.T2mQUq_blockTitle{margin:0;font-size:14px;font-weight:600}.T2mQUq_blockHint{color:var(--dsw-alias-label-tertiary,#8b93a1);margin:0;font-size:12px;line-height:1.6}.T2mQUq_list{flex-direction:column;gap:8px;margin:0;padding:0;list-style:none;display:flex}.T2mQUq_card{border:1px solid var(--dsw-alias-border-l2,#e5e7eb);background:var(--dsw-alias-bg-layer-3,#f7f8fa);border-radius:12px;flex-direction:column;gap:8px;padding:12px 14px;display:flex}.T2mQUq_cardHead{align-items:flex-start;gap:10px;display:flex}.T2mQUq_slash{font-size:14px;font-weight:600;line-height:22px}.T2mQUq_desc{color:var(--dsw-alias-label-tertiary,#8b93a1);margin:0;font-size:12px;line-height:1.5}.T2mQUq_kind{background:var(--dsw-alias-bg-module-platform,#eef0f3);color:var(--dsw-alias-label-secondary,#6b7280);border-radius:999px;flex:none;padding:1px 8px;font-size:11px;line-height:17px}.T2mQUq_grow{flex:1;min-width:0}.T2mQUq_actions{flex-wrap:wrap;gap:8px;display:flex}.T2mQUq_btn{-webkit-appearance:none;appearance:none;border:1px solid var(--dsw-alias-border-l2,#e5e7eb);background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#1f2328);font:inherit;cursor:pointer;border-radius:8px;padding:6px 12px;font-size:12px;line-height:18px}.T2mQUq_btn:hover:not(:disabled){border-color:var(--dsw-alias-label-dimmed,#9ca3af)}.T2mQUq_btn:disabled{opacity:.55;cursor:default}.T2mQUq_btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:2px}.T2mQUq_primary{background:var(--dsw-alias-brand-primary,#4f6ef7);border-color:var(--dsw-alias-brand-primary,#4f6ef7);color:#fff}.T2mQUq_danger{border-color:var(--dsw-alias-state-error-primary,#dc2626);color:var(--dsw-alias-state-error-primary,#dc2626)}.T2mQUq_form{flex-direction:column;gap:12px;padding-top:4px;display:flex}.T2mQUq_field{flex-direction:column;gap:6px;display:flex}.T2mQUq_label{font-size:13px;font-weight:500}.T2mQUq_hint{color:var(--dsw-alias-label-tertiary,#8b93a1);margin:0;font-size:12px;line-height:1.5}.T2mQUq_error{color:var(--dsw-alias-state-error-primary,#dc2626);margin:0;font-size:12px;line-height:1.5}.T2mQUq_ok{color:var(--dsw-alias-state-success-primary,#16a34a);margin:0;font-size:12px;line-height:1.5}.T2mQUq_input,.T2mQUq_textarea{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,#e5e7eb);background:var(--dsw-alias-bg-layer-1,#fff);width:100%;color:inherit;font:inherit;border-radius:8px;padding:8px 12px;font-size:13px}.T2mQUq_input{height:36px}.T2mQUq_textarea{resize:vertical;min-height:88px;line-height:1.5}.T2mQUq_input:focus,.T2mQUq_textarea:focus{outline:2px solid var(--dsw-alias-brand-primary,#4f6ef7);outline-offset:1px}.T2mQUq_invalid{border-color:var(--dsw-alias-state-error-primary,#dc2626)}.T2mQUq_preview{color:var(--dsw-alias-brand-primary,#4f6ef7);font-size:12px}.T2mQUq_payload{white-space:pre-wrap;word-break:break-word;color:var(--dsw-alias-label-secondary,#6b7280);margin:0;font-size:12px;line-height:1.5}.T2mQUq_status{color:var(--dsw-alias-label-tertiary,#8b93a1);margin:0;font-size:13px}.T2mQUq_banner{border:1px solid var(--dsw-alias-state-error-primary,#dc2626);background:color-mix(in srgb, var(--dsw-alias-state-error-primary,#dc2626) 8%, transparent);border-radius:10px;flex-direction:column;gap:8px;padding:10px 12px;display:flex}";
		const tagId = "deepseek-harness-ultra-slash/SettingsSection.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "deepseek-harness-ultra-slash";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var SettingsSection_module_css_default = {
			"blockHint": "T2mQUq_blockHint",
			"status": "T2mQUq_status",
			"btn": "T2mQUq_btn",
			"actions": "T2mQUq_actions",
			"desc": "T2mQUq_desc",
			"ok": "T2mQUq_ok",
			"preview": "T2mQUq_preview",
			"danger": "T2mQUq_danger",
			"label": "T2mQUq_label",
			"textarea": "T2mQUq_textarea",
			"section": "T2mQUq_section",
			"block": "T2mQUq_block",
			"grow": "T2mQUq_grow",
			"slash": "T2mQUq_slash",
			"input": "T2mQUq_input",
			"primary": "T2mQUq_primary",
			"cardHead": "T2mQUq_cardHead",
			"blockTitle": "T2mQUq_blockTitle",
			"list": "T2mQUq_list",
			"field": "T2mQUq_field",
			"error": "T2mQUq_error",
			"payload": "T2mQUq_payload",
			"banner": "T2mQUq_banner",
			"intro": "T2mQUq_intro",
			"card": "T2mQUq_card",
			"invalid": "T2mQUq_invalid",
			"kind": "T2mQUq_kind",
			"form": "T2mQUq_form",
			"hint": "T2mQUq_hint",
			"heading": "T2mQUq_heading"
		};
		//#endregion
		//#region src/client/SettingsSection.tsx
		const EMPTY = {
			name: "",
			description: "",
			steerText: ""
		};
		function slash(name) {
			return `/${name}`;
		}
		function takenNames(commands, except) {
			const names = /* @__PURE__ */ new Set();
			for (const command of commands) if (command.name !== except) names.add(command.name);
			return names;
		}
		function SettingsSection({ t, locale, cache }) {
			const [commands, setCommands] = (0, react.useState)(() => cache.list());
			const [load, setLoad] = (0, react.useState)("loading");
			const [loadError, setLoadError] = (0, react.useState)("");
			const [warning, setWarning] = (0, react.useState)("");
			const [draft, setDraft] = (0, react.useState)(EMPTY);
			const [busy, setBusy] = (0, react.useState)(false);
			const [notice, setNotice] = (0, react.useState)(null);
			const [editing, setEditing] = (0, react.useState)(null);
			const [editDraft, setEditDraft] = (0, react.useState)(EMPTY);
			const [confirmDelete, setConfirmDelete] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				return cache.subscribe(() => {
					setCommands(cache.list());
				});
			}, [cache]);
			(0, react.useEffect)(() => {
				let live = true;
				setLoad("loading");
				cache.refresh().then((result) => {
					if (!live) return;
					if (result.ok) {
						setLoad("ready");
						setLoadError("");
						setWarning(result.warning ?? "");
						return;
					}
					setLoad("error");
					setLoadError(result.message);
				});
				return () => {
					live = false;
				};
			}, [cache]);
			const previewName = normalizeCommandName(draft.name);
			const addCheck = (0, react.useMemo)(() => validateCustomCommand(draft, takenNames(commands)), [draft, commands]);
			const saveList = async (next, okText) => {
				setBusy(true);
				setNotice(null);
				const result = await cache.save(next);
				setBusy(false);
				if (!result.ok) {
					setNotice({
						kind: "error",
						text: result.message
					});
					return false;
				}
				setNotice({
					kind: "ok",
					text: okText
				});
				setConfirmDelete(null);
				setWarning("");
				return true;
			};
			const onAdd = async () => {
				if (busy || !addCheck.ok) return;
				if (await saveList([...commands, addCheck.command], t("settings.added", { slash: slash(addCheck.command.name) }))) setDraft(EMPTY);
			};
			const onSaveEdit = async (original) => {
				if (busy) return;
				const check = validateCustomCommand(editDraft, takenNames(commands, original));
				if (!check.ok) {
					setNotice({
						kind: "error",
						text: formatCatalogIssue(locale, check.issue)
					});
					return;
				}
				const next = commands.map((command) => command.name === original ? check.command : command);
				if (await saveList(next, t("settings.saved", { slash: slash(check.command.name) }))) {
					setEditing(null);
					setEditDraft(EMPTY);
				}
			};
			const onDelete = async (name) => {
				if (busy) return;
				const next = commands.filter((command) => command.name !== name);
				if (await saveList(next, t("settings.deleted", { slash: slash(name) }))) setEditing(null);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: SettingsSection_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
						className: SettingsSection_module_css_default.heading,
						children: t("settings.title")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: SettingsSection_module_css_default.intro,
						children: t("settings.intro")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: SettingsSection_module_css_default.block,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
								className: SettingsSection_module_css_default.blockTitle,
								children: t("settings.builtinTitle")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.blockHint,
								children: t("settings.builtinHint")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: SettingsSection_module_css_default.list,
								children: BUILTIN_SLASH_COMMANDS.map((command) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
									className: SettingsSection_module_css_default.card,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: SettingsSection_module_css_default.cardHead,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: SettingsSection_module_css_default.grow,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
												className: SettingsSection_module_css_default.slash,
												children: slash(command.name)
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: SettingsSection_module_css_default.desc,
												children: t(command.descriptionKey)
											})]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: SettingsSection_module_css_default.kind,
											children: t(command.kind === "steer" ? "settings.rowKindSteer" : command.kind === "session" ? "settings.rowKindSession" : "settings.rowKindAlias")
										})]
									})
								}, command.name))
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: SettingsSection_module_css_default.block,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
								className: SettingsSection_module_css_default.blockTitle,
								children: t("settings.customTitle")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.blockHint,
								children: t("settings.customHint")
							}),
							load === "loading" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.status,
								role: "status",
								children: t("settings.loading")
							}) : null,
							load === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: SettingsSection_module_css_default.banner,
								role: "alert",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: SettingsSection_module_css_default.error,
									children: [
										t("settings.loadFailed"),
										" ",
										loadError
									]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: `${SettingsSection_module_css_default.btn} ${SettingsSection_module_css_default.primary}`,
									onClick: () => {
										setLoad("loading");
										cache.refresh().then((result) => {
											if (result.ok) {
												setLoad("ready");
												setLoadError("");
												setWarning(result.warning ?? "");
												return;
											}
											setLoad("error");
											setLoadError(result.message);
										});
									},
									children: t("settings.retry")
								}) })]
							}) : null,
							warning !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.error,
								role: "status",
								children: warning
							}) : null,
							load === "ready" && commands.length === 0 && warning === "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.status,
								children: t("settings.empty")
							}) : null,
							load === "ready" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: SettingsSection_module_css_default.list,
								children: commands.map((command) => {
									const isEditing = editing === command.name;
									const deleting = confirmDelete === command.name;
									return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
										className: SettingsSection_module_css_default.card,
										children: isEditing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CommandForm, {
											t,
											locale,
											draft: editDraft,
											taken: takenNames(commands, command.name),
											busy,
											submitLabel: t("settings.save"),
											submittingLabel: t("settings.saving"),
											onChange: setEditDraft,
											onSubmit: () => {
												onSaveEdit(command.name);
											},
											onCancel: () => {
												setEditing(null);
												setEditDraft(EMPTY);
												setNotice(null);
											}
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: SettingsSection_module_css_default.cardHead,
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
													className: SettingsSection_module_css_default.grow,
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
														className: SettingsSection_module_css_default.slash,
														children: slash(command.name)
													}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
														className: SettingsSection_module_css_default.desc,
														children: command.description
													})]
												}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: SettingsSection_module_css_default.kind,
													children: t("settings.rowKindCustom")
												})]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
												className: SettingsSection_module_css_default.payload,
												children: command.steerText
											}),
											deleting ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: SettingsSection_module_css_default.actions,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
														className: SettingsSection_module_css_default.error,
														children: t("settings.deleteConfirm", { slash: slash(command.name) })
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														className: `${SettingsSection_module_css_default.btn} ${SettingsSection_module_css_default.danger}`,
														disabled: busy,
														onClick: () => {
															onDelete(command.name);
														},
														children: t("settings.deleteYes")
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														className: SettingsSection_module_css_default.btn,
														disabled: busy,
														onClick: () => setConfirmDelete(null),
														children: t("settings.cancel")
													})
												]
											}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: SettingsSection_module_css_default.actions,
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													className: SettingsSection_module_css_default.btn,
													disabled: busy,
													onClick: () => {
														setEditing(command.name);
														setEditDraft({
															name: command.name,
															description: command.description,
															steerText: command.steerText
														});
														setConfirmDelete(null);
														setNotice(null);
													},
													children: t("settings.edit")
												}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													className: `${SettingsSection_module_css_default.btn} ${SettingsSection_module_css_default.danger}`,
													disabled: busy,
													onClick: () => setConfirmDelete(command.name),
													children: t("settings.delete")
												})]
											})
										] })
									}, command.name);
								})
							}) : null,
							load === "ready" && commands.length >= 40 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.error,
								children: t("settings.maxReached", { max: 40 })
							}) : null,
							load === "ready" && commands.length < 40 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: SettingsSection_module_css_default.card,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CommandForm, {
									t,
									locale,
									draft,
									taken: takenNames(commands),
									busy,
									submitLabel: t("settings.add"),
									submittingLabel: t("settings.adding"),
									previewName,
									onChange: setDraft,
									onSubmit: () => {
										onAdd();
									}
								})
							}) : null,
							notice !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: notice.kind === "ok" ? SettingsSection_module_css_default.ok : SettingsSection_module_css_default.error,
								role: "status",
								children: notice.text
							}) : null
						]
					})
				]
			});
		}
		function CommandForm(props) {
			const formId = (0, react.useId)();
			const check = validateCustomCommand(props.draft, props.taken);
			const pristine = props.draft.name === "" && props.draft.description === "" && props.draft.steerText === "";
			const nameIssue = !pristine && !check.ok && check.issue.code.startsWith("name.") ? check.issue : null;
			const textIssue = !pristine && !check.ok && check.issue.code.startsWith("text.") ? check.issue : null;
			const descriptionIssue = !pristine && !check.ok && check.issue.code === "description.tooLong" ? check.issue : null;
			const preview = props.previewName !== void 0 && props.previewName.length > 0 ? slash(props.previewName) : null;
			const blocked = props.busy || !check.ok;
			const ids = {
				name: `${formId}-name`,
				description: `${formId}-description`,
				text: `${formId}-text`
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
				className: SettingsSection_module_css_default.form,
				onSubmit: (event) => {
					event.preventDefault();
					if (!blocked) props.onSubmit();
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: SettingsSection_module_css_default.field,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								className: SettingsSection_module_css_default.label,
								htmlFor: ids.name,
								children: props.t("settings.nameLabel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								id: ids.name,
								className: `${SettingsSection_module_css_default.input} ${nameIssue !== null ? SettingsSection_module_css_default.invalid : ""}`,
								value: props.draft.name,
								autoComplete: "off",
								spellCheck: false,
								disabled: props.busy,
								onChange: (event) => props.onChange({
									...props.draft,
									name: event.target.value
								})
							}),
							preview !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.preview,
								children: props.t("settings.namePreview", { slash: preview })
							}) : null,
							nameIssue !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.error,
								children: formatCatalogIssue(props.locale, nameIssue)
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.hint,
								children: props.t("settings.nameHint")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: SettingsSection_module_css_default.field,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								className: SettingsSection_module_css_default.label,
								htmlFor: ids.description,
								children: props.t("settings.descriptionLabel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								id: ids.description,
								className: `${SettingsSection_module_css_default.input} ${descriptionIssue !== null ? SettingsSection_module_css_default.invalid : ""}`,
								value: props.draft.description,
								disabled: props.busy,
								onChange: (event) => props.onChange({
									...props.draft,
									description: event.target.value
								})
							}),
							descriptionIssue !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.error,
								children: formatCatalogIssue(props.locale, descriptionIssue)
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.hint,
								children: props.t("settings.descriptionHint")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: SettingsSection_module_css_default.field,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								className: SettingsSection_module_css_default.label,
								htmlFor: ids.text,
								children: props.t("settings.textLabel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
								id: ids.text,
								className: `${SettingsSection_module_css_default.textarea} ${textIssue !== null ? SettingsSection_module_css_default.invalid : ""}`,
								value: props.draft.steerText,
								placeholder: props.t("settings.textPlaceholder"),
								disabled: props.busy,
								onChange: (event) => props.onChange({
									...props.draft,
									steerText: event.target.value
								})
							}),
							textIssue !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.error,
								children: formatCatalogIssue(props.locale, textIssue)
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: SettingsSection_module_css_default.hint,
								children: props.t("settings.textHint")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: SettingsSection_module_css_default.actions,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "submit",
							className: `${SettingsSection_module_css_default.btn} ${SettingsSection_module_css_default.primary}`,
							disabled: blocked,
							children: props.busy ? props.submittingLabel : props.submitLabel
						}), props.onCancel !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: SettingsSection_module_css_default.btn,
							disabled: props.busy,
							onClick: props.onCancel,
							children: props.t("settings.cancel")
						}) : null]
					})
				]
			});
		}
		//#endregion
		//#region src/client/index.ts
		/**
		* Browser half: ultra-slash `/` group, `/new` session switch, and the
		* settings page for custom `/steer` aliases.
		*/
		const DIVIDER_STYLE_ID = `${PLUGIN_NAME}-divider`;
		const name = PLUGIN_NAME;
		const inject = [
			"inputTriggers",
			"locale",
			"slots"
		];
		function injectDividerStyle() {
			if (typeof document === "undefined") return () => {};
			if (document.getElementById(DIVIDER_STYLE_ID) !== null) return () => {};
			const tag = document.createElement("style");
			tag.id = DIVIDER_STYLE_ID;
			tag.textContent = PLUGIN_SLASH_DIVIDER_CSS;
			document.head.appendChild(tag);
			return () => {
				tag.remove();
			};
		}
		function resolveLocale(ctx) {
			const fromField = ctx.locale;
			if (fromField !== void 0 && typeof fromField.bind === "function") return fromField;
			const fromGet = ctx.get("locale");
			if (fromGet !== null && typeof fromGet === "object" && "bind" in fromGet) return fromGet;
		}
		function bindMenuTranslate(locale) {
			if (locale?.bind !== void 0) return locale.bind(LOCALE_NS);
			return (key, vars) => {
				const template = zh[key] ?? key;
				if (vars === void 0) return template;
				return template.replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(vars, name) ? String(vars[name]) : match);
			};
		}
		function resolveTriggerService(ctx) {
			const fromField = ctx.inputTriggers;
			if (fromField !== void 0 && typeof fromField.registerSource === "function") return fromField;
			const fromGet = ctx.get("inputTriggers");
			if (fromGet !== null && typeof fromGet === "object" && "registerSource" in fromGet) return fromGet;
		}
		function resolveSlots(ctx) {
			if (ctx.slots !== void 0 && typeof ctx.slots.inject === "function") return ctx.slots;
			const fromGet = ctx.get("slots");
			if (fromGet !== null && typeof fromGet === "object" && "inject" in fromGet) return fromGet;
		}
		function syncHiddenNames(hidden, customNames) {
			hidden.clear();
			for (const name of PLUGIN_SLASH_NAMES) hidden.add(name);
			for (const name of customNames) hidden.add(name);
		}
		/** Register the ultra-slash group, /new bridge, and settings section. */
		function apply(ctx) {
			const inputTriggers = resolveTriggerService(ctx);
			if (inputTriggers === void 0) return;
			const locale = resolveLocale(ctx);
			const cache = createCatalogCache();
			const hiddenNames = new Set(PLUGIN_SLASH_NAMES);
			cache.refresh().then((result) => {
				if (result.ok) syncHiddenNames(hiddenNames, result.commands.map((command) => command.name));
			});
			ctx.effect(() => cache.subscribe(() => {
				syncHiddenNames(hiddenNames, cache.list().map((command) => command.name));
			}), `${PLUGIN_NAME}: hidden names`);
			ctx.effect(() => {
				if (locale === void 0) return () => {};
				const undoTitle = patchSlashMenuGroupTitle(locale);
				const undoDicts = typeof locale.register === "function" ? locale.register(LOCALE_NS, {
					zh,
					en
				}) : void 0;
				return () => {
					if (typeof undoDicts === "function") undoDicts();
					undoTitle();
				};
			}, `${PLUGIN_NAME}: locale`);
			ctx.effect(() => injectDividerStyle(), `${PLUGIN_NAME}: slash divider`);
			ctx.effect(() => {
				const t = bindMenuTranslate(locale);
				const source = {
					trigger: "/",
					name: PLUGIN_SLASH_SOURCE,
					order: 100,
					candidates: (_session, req) => Promise.resolve(pluginSlashCandidates(req.query, req.position === "leading", t, cache.list())),
					onPick: (pick) => {
						const command = findCommandSource(inputTriggers);
						if (command !== void 0) return command.onPick(pick);
						const candidate = pick?.candidate;
						const commandName = typeof candidate?.name === "string" ? candidate.name : "";
						if (commandName === "") return void 0;
						return { text: `/${commandName} ` };
					}
				};
				const unregister = inputTriggers.registerSource(source);
				return () => {
					unregister();
				};
			}, `${PLUGIN_NAME}: ultra-slash source`);
			ctx.effect(() => installCommandSourceFilter(inputTriggers, hiddenNames), `${PLUGIN_NAME}: hide plugin names from 命令`);
			ctx.effect(() => installNewSessionBridge(inputTriggers, () => {
				startNewSession((name) => ctx.get(name));
			}), `${PLUGIN_NAME}: /new session`);
			const slots = resolveSlots(ctx);
			if (slots !== void 0) ctx.effect(() => {
				const t = bindMenuTranslate(locale);
				slots.inject("settings.section", () => slots.register({
					name: "settings.section",
					id: "ultra-slash",
					order: 28,
					label: () => t("settings.nav"),
					locale: LOCALE_NS
				}, () => (0, react.createElement)(SettingsSection, {
					t,
					locale: locale?.getSnapshot?.()?.active === "en" ? "en" : "zh",
					cache
				})));
				return () => {};
			}, `${PLUGIN_NAME}: settings`);
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map