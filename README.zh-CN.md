# PoE Filter Skill

[English](README.md) | [简体中文](README.zh-CN.md)

用于编辑《流放之路》1（Path of Exile 1）物品过滤器的 Codex skill，支持保留自定义修改、验证变更，并通过 Git 记录验收通过的文件。

当前 skill 版本：**0.2.2**。完整工作流程与适用范围见 [SKILL.md](SKILL.md)。

## 功能

- 编辑本地 `.filter` 文件，同时保留无关规则、注释、音效和格式。
- 在用户明确要求更新上游版本时，保留标记为自定义所有的修改。
- 从只读的 `OnlineFilters` 输入创建独立的本地派生文件。
- 使用内置的只读 Python 脚本检查语法，并另行验证规则行为。
- 按需使用 FilterBlade 工作流程，处理原生可编辑项目、离线生成及明确指定的网页操作。
- 明确选择文件，通过 Git 记录验收通过的本地过滤器变更。

本 skill 适用于 **PoE 1**。Ruthless（无情模式）需要明确选择，并确认规则兼容性。不支持 PoE 2，也不向在线过滤器缓存写入内容。

普通本地编辑无需使用 FilterBlade。选择 FilterBlade 生成模式后，默认使用兼容且已获准访问的资源离线处理。本仓库不附带网站资源、浏览器运行环境或 MCP 依赖，也不会自动安装这些组件。云端保存与 PoE 同步属于需要单独选择的目标。

## 安装

将本仓库克隆到个人 skills 目录中的 `poe-filter` 文件夹。对于使用 `~/.agents/skills` 的现有 Windows 配置：

```powershell
git clone https://github.com/WhiT-Eboard/poe-filter-skill.git "$env:USERPROFILE\.agents\skills\poe-filter"
```

如果目标目录已存在，请先检查其中内容，再决定更新或替换。也可以将本仓库文件复制到名为 `poe-filter` 的 skill 文件夹，保持 `SKILL.md`、`agents`、`references` 和 `scripts` 的相对位置不变。如果 Codex 未显示该 skill，可尝试重启。

## 使用

通过 `$poe-filter` 调用，并说明目标文件、预期行为、游戏模式和输出位置。例如：

```text
使用 $poe-filter 检查我的本地过滤器，解释哪些规则会隐藏稀有戒指。

使用 $poe-filter，将我的本地 PoE 1 过滤器中堆叠数量至少为 10 的通货
字体调大。保留所有无关行为，并验证数量边界。

使用 $poe-filter 的 FilterBlade 模式，基于我已批准使用的缓存资源，
生成本地过滤器和可编辑项目。通过重新加载回放验证两个输出。
```

编辑过滤器时，请提供相关路径，以及 PoE 1 补丁或赛季信息。Skill 会检查范围与兼容性、保护已有内容、验证候选文件，并在 Git 可用时记录验收通过的本地变更。保存后，需要在游戏中重新加载或选择该过滤器才能生效。

## 运行要求与语法预检

普通编辑使用代理已有的文件工具。Git 用于记录本地历史；内置语法检查器需要 **Python 3.11+**。检查器仅使用 Python 标准库，无需模型 API、开发项目源码或网络访问。

在本仓库或已安装的 skill 目录中运行：

```powershell
python scripts/check_filter.py "C:\path\to\MyFilter.filter" --json
```

只有明确选择 Ruthless 过滤器时才添加 `--mode ruthless`。检查器不会修改输入文件。退出码 `0` 表示在已定义的检查范围内有效，`1` 表示无效，`2` 表示输入无法读取或用法错误，`3` 表示检查覆盖不完整。

语法检查通过不代表物品匹配、规则优先级、导入文件可用性或游戏客户端加载均已验证。详见[检查器覆盖范围与限制](references/syntax-checker.md)。

## 仓库内容

| 路径 | 用途 |
| --- | --- |
| [SKILL.md](SKILL.md) | Skill 入口、模式选择、操作范围、验证及 Git 工作流程 |
| [agents/openai.yaml](agents/openai.yaml) | Skill 显示信息与默认提示词 |
| [references](references/) | 规则、自定义修改归属、语法和 FilterBlade 模式的专项说明 |
| [scripts/check_filter.py](scripts/check_filter.py) | 可独立运行的只读 PoE 1 语法预检脚本 |
| [scripts/filterblade_page.js](scripts/filterblade_page.js) | 用于受支持 FilterBlade 网页操作的可选辅助脚本 |
| [scripts/filterblade_project.js](scripts/filterblade_project.js) | 用于兼容 FilterBlade 原生项目操作的可选辅助脚本 |

本 Git 仓库仅追踪独立 skill、相关文档与仓库配置，不包含开发原型、研究产物、下载的网站资源或生成的过滤器。辅助脚本的兼容性要求与操作限制见相应的 [FilterBlade 参考文档](references/filterblade.md)。

## 许可证与致谢

本项目采用 [MIT 许可证](LICENSE)。基于 NeverSink 的样式参考保留其独立的 [MIT 许可声明](references/neversink-license.txt)。

本项目独立开发，与 FilterBlade、NeverSink 及其团队无隶属关系。欢迎通过 [FilterBlade 官方网站](https://www.filterblade.xyz/)或 [NeverSink 主页](https://github.com/NeverSinkDev)支持他们的工作。
