import { useState } from 'react';
import type { Key, KeyboardEvent } from 'react';
import type { DataType, EditableField, VariableRow } from '../domain/types';
import { createEmptyRow, updateRowDataType } from '../domain/rows';
import { validateDefaultValue, validateVariableName } from '../domain/validation';
import { translateValidationMessage } from '../i18n';
import type { Language } from '../i18n';

/** 当前编辑器同一时间只允许一个单元格处于编辑状态。 */
export interface EditingCell {
  rowId: string;
  field: EditableField;
}

export interface Notice {
  kind: 'error' | 'success';
  message: string;
}

/**
 * 简单的内存自增 id 生成器。
 *
 * 页面展示的 Index 列由当前表格顺序计算得到；这里的 id 只用于
 * React key、Ant Design 行选择，以及稳定地定位需要更新的行。
 */
let nextRowId = 1;

function createRowId() {
  const id = `variable-row-${nextRowId}`;
  nextRowId += 1;
  return id;
}

function getFieldValue(row: VariableRow, field: EditableField) {
  return row[field];
}

/**
 * 变量表的全部业务交互状态。
 *
 * 把这些逻辑从 App.tsx 中抽出来后，App 只负责页面组装；
 * 新增、删除、编辑、校验、checkbox 多选等规则集中在这个 hook 中维护。
 */
export function useVariableTableEditor(language: Language) {
  const [rows, setRows] = useState<VariableRow[]>([]);

  /**
   * Checkbox 多选状态。
   *
   * 关键交互规则：只有 Ant Design checkbox 的选择回调可以修改该状态。
   * 新增行、点击行背景、编辑单元格都不能自动选中行。
   */
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  /** 单元格编辑草稿状态；非法提交会丢弃草稿，从而保留原始值。 */
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [notice, setNotice] = useState<Notice | null>(null);

  function showError(message: string) {
    setNotice({ kind: 'error', message });
  }

  function clearNotice() {
    setNotice(null);
  }

  /**
   * AC 2：在表格末尾新增一行完全空白的数据。
   * 新增行不会被默认选中；只有用户主动勾选 checkbox 才能改变 selectedRowIds。
   */
  function handleAddRow() {
    const row = createEmptyRow(createRowId());
    setRows((currentRows) => [...currentRows, row]);
    setEditingCell(null);
    setDraftValue('');
    clearNotice();
  }

  /**
   * 删除所有通过 checkbox 选中的行。
   * 使用 Set 可以避免批量删除时反复执行线性 includes 查找。
   */
  function handleDeleteRow() {
    if (selectedRowIds.length === 0) {
      return;
    }

    setRows((currentRows) => {
      const selectedIdSet = new Set(selectedRowIds);
      return currentRows.filter((row) => !selectedIdSet.has(row.id));
    });
    setSelectedRowIds([]);
    setEditingCell(null);
    setDraftValue('');
    clearNotice();
  }

  /**
   * 进入某个单元格的编辑状态，但不影响 checkbox 选择状态。
   * 当前单元格值会先复制到 draftValue，按 Esc 或输入非法值时只需丢弃草稿即可取消编辑。
   */
  function startEditing(row: VariableRow, field: EditableField) {
    setEditingCell({ rowId: row.id, field });
    setDraftValue(getFieldValue(row, field));
    clearNotice();
  }

  function cancelEditing() {
    setEditingCell(null);
    setDraftValue('');
  }

  /**
   * 提交当前正在编辑的单元格。
   *
   * - Name 和 Default Value 需要经过 domain 层校验。
   * - 非法输入会展示错误提示，并保持原始行数据不变。
   * - Comment 接受任意文本，包括空字符串。
   */
  function commitEditing() {
    if (!editingCell) {
      return;
    }

    const row = rows.find((candidate) => candidate.id === editingCell.rowId);
    if (!row) {
      cancelEditing();
      return;
    }

    if (editingCell.field === 'name') {
      const result = validateVariableName(draftValue, rows, row.id);
      if (!result.ok) {
        showError(translateValidationMessage(result.message, language));
        cancelEditing();
        return;
      }

      setRows((currentRows) =>
        currentRows.map((candidate) =>
          candidate.id === row.id ? { ...candidate, name: result.value } : candidate,
        ),
      );
      cancelEditing();
      clearNotice();
      return;
    }

    if (editingCell.field === 'defaultValue') {
      const result = validateDefaultValue(row.dataType, draftValue);
      if (!result.ok) {
        showError(translateValidationMessage(result.message, language));
        cancelEditing();
        return;
      }

      setRows((currentRows) =>
        currentRows.map((candidate) =>
          candidate.id === row.id
            ? { ...candidate, defaultValue: result.value }
            : candidate,
        ),
      );
      cancelEditing();
      clearNotice();
      return;
    }

    if (editingCell.field === 'comment') {
      setRows((currentRows) =>
        currentRows.map((candidate) =>
          candidate.id === row.id ? { ...candidate, comment: draftValue } : candidate,
        ),
      );
      cancelEditing();
      clearNotice();
      return;
    }

    cancelEditing();
  }

  /** AC 5：切换 Data Type 时立即重置对应的 Default Value。 */
  function commitDataType(rowId: string, dataType: Exclude<DataType, ''>) {
    setRows((currentRows) => updateRowDataType(currentRows, rowId, dataType));
    cancelEditing();
    clearNotice();
  }

  /** 所有文本编辑框共用的键盘行为。 */
  function handleDraftKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitEditing();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
    }
  }

  /** 将 Ant Design 返回的行 key 统一转换为当前项目使用的字符串 id。 */
  function handleSelectionChange(selectedKeys: Key[]) {
    setSelectedRowIds(selectedKeys.map((key) => String(key)));
  }

  return {
    rows,
    selectedRowIds,
    editingCell,
    draftValue,
    notice,
    setDraftValue,
    handleAddRow,
    handleDeleteRow,
    startEditing,
    cancelEditing,
    commitEditing,
    commitDataType,
    handleDraftKeyDown,
    handleSelectionChange,
  };
}
