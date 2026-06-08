import { Button } from 'antd';
import type { UiCopy } from '../i18n';

interface AppHeaderProps {
  t: UiCopy;
  rowCount: number;
  selectedCount: number;
  onToggleLanguage: () => void;
}

/** 页面顶部标题区：只负责展示标题、说明、语言切换和表格摘要。 */
export function AppHeader({
  t,
  rowCount,
  selectedCount,
  onToggleLanguage,
}: AppHeaderProps) {
  return (
    <section className="workspace-header" aria-labelledby="page-title">
      <div>
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 id="page-title">{t.title}</h1>
        <p className="intro">{t.intro}</p>
      </div>
      <div className="header-side">
        <Button
          data-testid="language-toggle"
          className="language-toggle"
          onClick={onToggleLanguage}
        >
          {t.languageButton}
        </Button>
        <div className="header-meta" aria-label={t.aria.summary}>
          <span>{t.variables(rowCount)}</span>
          <span>{selectedCount > 0 ? t.selected(selectedCount) : t.noRowSelected}</span>
        </div>
      </div>
    </section>
  );
}
