# 变量表编辑器

这是一个简化版变量表编辑器，使用 React、TypeScript、Vite 和 Ant Design Table 构建。

## 功能说明

- 使用 Ant Design Table 展示可编辑变量表，包含 `Index`、`Name`、`Data Type`、`Default Value`、`Comment` 列。
- 新增 checkbox 选择列，支持多选行。
- 支持在表格末尾新增空白行，新增行不会默认选中。
- 支持删除所有选中行，并自动重新计算显示序号。
- 变量名必填，且需要大小写不敏感地保持唯一。
- 数据类型仅支持 `BOOL` 和 `INT`。
- 切换数据类型时自动重置默认值：`BOOL -> TRUE`，`INT -> 0`。
- `BOOL` 默认值仅接受 `TRUE` 或 `FALSE`，输入大小写不敏感，展示统一为大写。
- `INT` 默认值仅接受 32 位有符号整数，范围为 `[-2147483648, 2147483647]`。
- `Comment` 允许输入任意文本，也可以为空。
- 页面右上角提供中英文切换按钮。
- 通过分页控制表格默认高度，常规使用下尽量避免表格内部纵向滚动条。

## 运行方式

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

指定端口启动，例如 `5174`：

```bash
npm run dev -- --port 5174
```

运行单元测试：

```bash
npm test
```

构建生产版本：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

## 项目结构

```text
src/
  App.tsx                  # 应用装配层、主题配置和语言状态
  App.css                  # 页面样式
  i18n.ts                  # 中英文界面文案和校验提示翻译
  main.tsx                 # React 入口文件
  components/
    AppHeader.tsx          # 页面标题、语言切换和表格摘要
    EditorToolbar.tsx      # 新增和删除操作
    VariableTable.tsx      # Ant Design Table 列定义和可编辑单元格
  hooks/
    useVariableTableEditor.ts # 表格状态、校验流程和行操作
  domain/
    rows.ts                # 行创建和数据类型更新工具
    types.ts               # 共享 TypeScript 类型
    validation.ts          # 名称和默认值校验规则
    validation.test.ts     # 校验与行工具的单元测试
```

## 交互说明

- 使用 checkbox 选择列可选择一行或多行。
- 使用表格底部分页组件切换页码或调整每页条数。
- 点击 `Name`、`Default Value` 或 `Comment` 单元格可进入编辑状态。
- 双击 `Data Type` 单元格可选择 `BOOL` 或 `INT`。
- 按 `Enter` 或离开单元格会保存编辑内容。
- 按 `Esc` 会取消当前编辑。
- 未选中任何行时，`Delete Row` 按钮不可用。

## 关键规则

### Name 校验

- 不能为空。
- 不能与其他行重复。
- 重复判断大小写不敏感，例如 `counter` 和 `Counter` 视为重复。

### Data Type 规则

- 只支持 `BOOL` 和 `INT`。
- 切换到 `BOOL` 时，默认值自动变成 `TRUE`。
- 切换到 `INT` 时，默认值自动变成 `0`。

### Default Value 规则

- `BOOL`：只接受 `true`、`false`、`TRUE`、`FALSE`，保存后统一显示为 `TRUE` 或 `FALSE`。
- `INT`：只接受整数，范围必须是 `[-2147483648, 2147483647]`。

## 测试

当前单元测试覆盖：

- Name 空值校验。
- Name 大小写不敏感重复校验。
- BOOL 默认值格式化与非法输入。
- INT 范围校验和非整数校验。
- 切换 `dataType` 后默认值自动重置。
