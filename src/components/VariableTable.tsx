import { useEffect, useState } from 'react';
import type { HTMLAttributes, Key, KeyboardEvent } from 'react';
import { Input, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataType, EditableField, VariableRow } from '../domain/types';
import type { EditingCell } from '../hooks/useVariableTableEditor';
import type { UiCopy } from '../i18n';

/** Ant Design 行属性，并额外带上浏览器验证使用的测试标识。 */
type TableRowAttributes = HTMLAttributes<HTMLElement> & { 'data-testid': string };

/** 任务要求的数据类型选项；空类型只是新增行初始状态，不能被用户选择。 */
const DATA_TYPE_OPTIONS: Array<Exclude<DataType, ''>> = ['BOOL', 'INT'];
const DEFAULT_PAGE_SIZE = 5;

interface VariableTableProps {
  t: UiCopy;
  rows: VariableRow[];
  selectedRowIds: string[];
  editingCell: EditingCell | null;
  draftValue: string;
  onDraftChange: (value: string) => void;
  onStartEditing: (row: VariableRow, field: EditableField) => void;
  onCancelEditing: () => void;
  onCommitEditing: () => void;
  onCommitDataType: (rowId: string, dataType: Exclude<DataType, ''>) => void;
  onDraftKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSelectionChange: (selectedKeys: Key[]) => void;
}

function isEditingCell(
  editingCell: EditingCell | null,
  rowId: string,
  field: EditableField,
) {
  return editingCell?.rowId === rowId && editingCell.field === field;
}

/**
 * 变量表主体。
 *
 * 这个组件只负责 Ant Design Table 的列定义和单元格渲染；
 * 具体数据更新、校验和错误处理都由 useVariableTableEditor 负责。
 */
export function VariableTable({
  t,
  rows,
  selectedRowIds,
  editingCell,
  draftValue,
  onDraftChange,
  onStartEditing,
  onCancelEditing,
  onCommitEditing,
  onCommitDataType,
  onDraftKeyDown,
  onSelectionChange,
}: VariableTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  /**
   * 分页后 Ant Design 传入的 index 是当前页内序号。
   * 这里转换成全表序号，避免第二页重新从 1 开始显示。
   */
  function getDisplayIndex(pageIndex: number) {
    return (currentPage - 1) * pageSize + pageIndex + 1;
  }

  /** 删除行或切换 pageSize 后，避免 currentPage 停留在不存在的页码。 */
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(rows.length / pageSize));

    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [currentPage, pageSize, rows.length]);

  const columns: ColumnsType<VariableRow> = [
    {
      title: t.columns.index,
      key: 'index',
      width: 88,
      render: (_value, _record, index) => {
        const displayIndex = getDisplayIndex(index);

        return (
          <span className="index-cell" aria-label={t.aria.index(displayIndex - 1)}>
            {displayIndex}
          </span>
        );
      },
    },
    {
      title: t.columns.name,
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (_value, record, index) =>
        isEditingCell(editingCell, record.id, 'name') ? (
          <Input
            autoFocus
            className="cell-input"
            value={draftValue}
            onChange={(event) => onDraftChange(event.target.value)}
            onBlur={onCommitEditing}
            onKeyDown={onDraftKeyDown}
            onClick={(event) => event.stopPropagation()}
            aria-label={t.aria.name(getDisplayIndex(index) - 1)}
          />
        ) : (
          <button
            type="button"
            className="cell-trigger"
            data-testid={`name-cell-${getDisplayIndex(index)}`}
            onClick={(event) => {
              event.stopPropagation();
              onStartEditing(record, 'name');
            }}
          >
            <span className={record.name ? undefined : 'placeholder'}>
              {record.name || t.clickToEdit}
            </span>
          </button>
        ),
    },
    {
      title: t.columns.dataType,
      dataIndex: 'dataType',
      key: 'dataType',
      width: 190,
      render: (_value, record, index) =>
        isEditingCell(editingCell, record.id, 'dataType') ? (
          <Select
            autoFocus
            className="cell-select"
            value={record.dataType || undefined}
            placeholder={t.selectType}
            options={DATA_TYPE_OPTIONS.map((option) => ({
              label: option,
              value: option,
            }))}
            onChange={(value) => onCommitDataType(record.id, value)}
            onBlur={onCancelEditing}
            onClick={(event) => event.stopPropagation()}
            aria-label={t.aria.dataType(getDisplayIndex(index) - 1)}
          />
        ) : (
          <button
            type="button"
            className="cell-trigger type-trigger"
            data-testid={`data-type-cell-${getDisplayIndex(index)}`}
            onDoubleClick={(event) => {
              event.stopPropagation();
              onStartEditing(record, 'dataType');
            }}
          >
            {record.dataType ? (
              <Tag color="blue">{record.dataType}</Tag>
            ) : (
              <span className="placeholder">{t.doubleClick}</span>
            )}
          </button>
        ),
    },
    {
      title: t.columns.defaultValue,
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 230,
      render: (_value, record, index) =>
        isEditingCell(editingCell, record.id, 'defaultValue') ? (
          <Input
            autoFocus
            className="cell-input mono-input"
            value={draftValue}
            onChange={(event) => onDraftChange(event.target.value)}
            onBlur={onCommitEditing}
            onKeyDown={onDraftKeyDown}
            onClick={(event) => event.stopPropagation()}
            aria-label={t.aria.defaultValue(getDisplayIndex(index) - 1)}
          />
        ) : (
          <button
            type="button"
            className="cell-trigger mono-cell"
            data-testid={`default-value-cell-${getDisplayIndex(index)}`}
            onClick={(event) => {
              event.stopPropagation();
              onStartEditing(record, 'defaultValue');
            }}
          >
            <span className={record.defaultValue ? undefined : 'placeholder'}>
              {record.defaultValue || t.clickToEdit}
            </span>
          </button>
        ),
    },
    {
      title: t.columns.comment,
      dataIndex: 'comment',
      key: 'comment',
      render: (_value, record, index) =>
        isEditingCell(editingCell, record.id, 'comment') ? (
          <Input
            autoFocus
            className="cell-input"
            value={draftValue}
            onChange={(event) => onDraftChange(event.target.value)}
            onBlur={onCommitEditing}
            onKeyDown={onDraftKeyDown}
            onClick={(event) => event.stopPropagation()}
            aria-label={t.aria.comment(getDisplayIndex(index) - 1)}
          />
        ) : (
          <button
            type="button"
            className="cell-trigger comment-trigger"
            data-testid={`comment-cell-${getDisplayIndex(index)}`}
            onClick={(event) => {
              event.stopPropagation();
              onStartEditing(record, 'comment');
            }}
          >
            <span className={record.comment ? undefined : 'placeholder'}>
              {record.comment || t.optionalComment}
            </span>
          </button>
        ),
    },
  ];

  return (
    <div className="table-frame">
      <Table<VariableRow>
        className="variable-table"
        data-testid="variable-table"
        rowKey="id"
        columns={columns}
        dataSource={rows}
        pagination={{
          current: currentPage,
          pageSize,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20],
          hideOnSinglePage: false,
          showTotal: (total) => t.paginationTotal(total),
          onChange: (nextPage, nextPageSize) => {
            setCurrentPage(nextPage);
            setPageSize(nextPageSize);
          },
        }}
        locale={{ emptyText: t.emptyTable }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRowIds,
          onChange: onSelectionChange,
          columnWidth: 56,
        }}
        rowClassName={(record) =>
          selectedRowIds.includes(record.id) ? 'selected-row' : ''
        }
        // 这里只提供测试标识；点击行本身不会触发行选择。
        onRow={(_record, index) =>
          ({
            'data-testid': `variable-row-${getDisplayIndex(index ?? 0)}`,
          }) as TableRowAttributes
        }
        scroll={{ x: 956 }}
      />
    </div>
  );
}
