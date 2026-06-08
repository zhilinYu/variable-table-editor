import { useState } from 'react';
import { Alert, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { AppHeader } from './components/AppHeader';
import { EditorToolbar } from './components/EditorToolbar';
import { VariableTable } from './components/VariableTable';
import { useVariableTableEditor } from './hooks/useVariableTableEditor';
import { UI_COPY } from './i18n';
import type { Language } from './i18n';

/**
 * 应用装配层。
 *
 * 这里只负责语言切换、Ant Design 主题配置，以及把 hook 状态传给页面组件；
 * 具体表格交互逻辑在 useVariableTableEditor，表格渲染在 VariableTable。
 */
export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const editor = useVariableTableEditor(language);
  const t = UI_COPY[language];

  function toggleLanguage() {
    setLanguage((current) => (current === 'en' ? 'zh' : 'en'));
  }

  return (
    <ConfigProvider
      locale={language === 'zh' ? zhCN : enUS}
      theme={{
        token: {
          colorPrimary: '#1664ff',
          borderRadius: 12,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
    >
      <main className="app-shell">
        <AppHeader
          t={t}
          rowCount={editor.rows.length}
          selectedCount={editor.selectedRowIds.length}
          onToggleLanguage={toggleLanguage}
        />

        <section className="editor-panel" aria-label={t.aria.editor}>
          <EditorToolbar
            t={t}
            selectedCount={editor.selectedRowIds.length}
            onAddRow={editor.handleAddRow}
            onDeleteRows={editor.handleDeleteRow}
          />

          {editor.notice ? (
            <Alert
              className="notice"
              type={editor.notice.kind}
              title={editor.notice.message}
              showIcon
              role="status"
            />
          ) : null}

          <VariableTable
            t={t}
            rows={editor.rows}
            selectedRowIds={editor.selectedRowIds}
            editingCell={editor.editingCell}
            draftValue={editor.draftValue}
            onDraftChange={editor.setDraftValue}
            onStartEditing={editor.startEditing}
            onCancelEditing={editor.cancelEditing}
            onCommitEditing={editor.commitEditing}
            onCommitDataType={editor.commitDataType}
            onDraftKeyDown={editor.handleDraftKeyDown}
            onSelectionChange={editor.handleSelectionChange}
          />
        </section>
      </main>
    </ConfigProvider>
  );
}
