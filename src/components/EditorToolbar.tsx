import { Button, Space } from 'antd';
import type { UiCopy } from '../i18n';

interface EditorToolbarProps {
  t: UiCopy;
  selectedCount: number;
  onAddRow: () => void;
  onDeleteRows: () => void;
}

/** 表格操作栏：集中放新增和删除动作，便于 App.tsx 保持简洁。 */
export function EditorToolbar({
  t,
  selectedCount,
  onAddRow,
  onDeleteRows,
}: EditorToolbarProps) {
  return (
    <div className="toolbar">
      <div>
        <h2>{t.panelTitle}</h2>
        <p>{t.panelHint}</p>
      </div>
      <Space className="toolbar-actions" wrap>
        <Button type="primary" data-testid="add-row-button" onClick={onAddRow}>
          {t.addRow}
        </Button>
        <Button
          data-testid="delete-row-button"
          onClick={onDeleteRows}
          disabled={selectedCount === 0}
        >
          {t.deleteRow}
        </Button>
      </Space>
    </div>
  );
}
