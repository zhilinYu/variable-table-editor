# Table Editor

[中文 README](./README.zh-CN.md)

A simplified variable table editor. The app is built with React, TypeScript, Vite, and Ant Design Table.

## English

### Features

- Displays an editable variable table with `Index`, `Name`, `Data Type`, `Default Value`, and `Comment` columns using Ant Design Table.
- Adds a blank row at the end of the table.
- Adds a checkbox selection column and supports selecting multiple rows.
- Deletes all selected rows and automatically recalculates the displayed indexes.
- Validates variable names as required and unique, case-insensitively.
- Supports `BOOL` and `INT` data types only.
- Resets the default value when the data type changes: `BOOL -> TRUE`, `INT -> 0`.
- Validates `BOOL` defaults as `TRUE` or `FALSE` and normalizes display to uppercase.
- Validates `INT` defaults as signed 32-bit integers from `-2147483648` to `2147483647`.
- Allows any text, including empty text, in the `Comment` column.
- Provides an English / Chinese UI language toggle in the upper-right corner.
- Uses pagination to keep the table compact and avoid internal vertical scrolling in normal use.

### Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run on a specific port, for example `5174`:

```bash
npm run dev -- --port 5174
```

Run unit tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Project Structure

```text
src/
  App.tsx                  # Application composition, theme, and language state
  App.css                  # Application styling
  i18n.ts                  # English / Chinese UI copy and validation message translation
  main.tsx                 # React entry point
  components/
    AppHeader.tsx          # Page title, language toggle, and table summary
    EditorToolbar.tsx      # Add / delete actions
    VariableTable.tsx      # Ant Design Table columns and editable cells
  hooks/
    useVariableTableEditor.ts # Table state, validation flow, and row operations
  domain/
    rows.ts                # Row creation and data type update helpers
    types.ts               # Shared TypeScript types
    validation.ts          # Name and default value validation rules
    validation.test.ts     # Unit tests for validation and row helpers
```

### Interaction Notes

- Use the checkbox column to select one or more rows.
- Use the pagination control below the table to switch pages or change page size.
- Click `Name`, `Default Value`, or `Comment` cells to edit them.
- Double-click a `Data Type` cell to choose `BOOL` or `INT` from the dropdown.
- Press `Enter` or leave the cell to save an edit.
- Press `Esc` to cancel an edit.
- `Delete Row` is disabled until at least one row is selected.

## 中文

### 功能说明

- 使用 Ant Design Table 展示可编辑变量表，包含 `Index`、`Name`、`Data Type`、`Default Value`、`Comment` 列。
- 支持在表格末尾新增空白行。
- 新增 checkbox 选择列，支持多选行。
- 支持删除所有选中行，并自动重新计算显示序号。
- 变量名必填，且需要大小写不敏感地保持唯一。
- 数据类型仅支持 `BOOL` 和 `INT`。
- 切换数据类型时自动重置默认值：`BOOL -> TRUE`，`INT -> 0`。
- `BOOL` 默认值仅接受 `TRUE` 或 `FALSE`，输入大小写不敏感，展示统一为大写。
- `INT` 默认值仅接受 32 位有符号整数，范围为 `-2147483648` 到 `2147483647`。
- `Comment` 允许输入任意文本，也可以为空。
- 页面右上角提供中英文切换按钮。

### 运行方式

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

### 项目结构

```text
src/
  App.tsx                  # 主表格编辑器界面和交互逻辑
  App.css                  # 页面样式
  main.tsx                 # React 入口文件
  domain/
    rows.ts                # 行创建和数据类型更新工具
    types.ts               # 共享 TypeScript 类型
    validation.ts          # 名称和默认值校验规则
    validation.test.ts     # 校验与行工具的单元测试
```

### 交互说明

- 使用 checkbox 选择列可选择一行或多行。
- 点击 `Name`、`Default Value` 或 `Comment` 单元格可进入编辑状态。
- 双击 `Data Type` 单元格可选择 `BOOL` 或 `INT`。
- 按 `Enter` 或离开单元格会保存编辑内容。
- 按 `Esc` 会取消当前编辑。
- 未选中任何行时，`Delete Row` 按钮不可用。
