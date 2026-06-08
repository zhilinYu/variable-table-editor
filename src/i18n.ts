/**
 * 编辑器支持的界面语言。
 *
 * 显式定义语言类型可以让文案读取和语言切换在整个应用中保持类型安全。
 */
export type Language = 'en' | 'zh';

/**
 * 所有可见界面文案集中放在这里，避免 App.tsx 中的表格逻辑和翻译字符串混在一起。
 * 对于这个小型面试作业，使用轻量对象比引入完整 i18n 框架更合适。
 */
export const UI_COPY = {
  en: {
    languageButton: '中文',
    eyebrow: 'Variable table workspace',
    title: 'Table Editor',
    intro: 'Create and maintain PLC variables with type-aware default value validation.',
    variables: (count: number) => `${count} ${count === 1 ? 'variable' : 'variables'}`,
    selected: (count: number) => `${count} ${count === 1 ? 'row' : 'rows'} selected`,
    noRowSelected: 'No rows selected',
    panelTitle: 'Variables',
    panelHint: 'Click editable cells to change values. Double-click Data Type.',
    addRow: 'Add Row',
    deleteRow: 'Delete Row',
    emptyTable: 'Empty table. Use Add Row to create the first variable.',
    clickToEdit: 'Click to edit',
    doubleClick: 'Double-click',
    optionalComment: 'Optional comment',
    selectType: 'Select type',
    paginationTotal: (total: number) => `${total} ${total === 1 ? 'item' : 'items'}`,
    columns: {
      index: 'Index',
      name: 'Name',
      dataType: 'Data Type',
      defaultValue: 'Default Value',
      comment: 'Comment',
    },
    aria: {
      summary: 'Table summary',
      editor: 'Variable table editor',
      index: (index: number) => `Index ${index + 1}`,
      name: (index: number) => `Name for row ${index + 1}`,
      dataType: (index: number) => `Data type for row ${index + 1}`,
      defaultValue: (index: number) => `Default value for row ${index + 1}`,
      comment: (index: number) => `Comment for row ${index + 1}`,
    },
  },
  zh: {
    languageButton: 'English',
    eyebrow: '变量表工作区',
    title: '变量表编辑器',
    intro: '创建并维护 PLC 变量，默认值会按照数据类型进行校验。',
    variables: (count: number) => `${count} 个变量`,
    selected: (count: number) => `已选择 ${count} 行`,
    noRowSelected: '未选择行',
    panelTitle: '变量列表',
    panelHint: '点击可编辑单元格修改内容，双击 Data Type 选择数据类型。',
    addRow: '新增行',
    deleteRow: '删除行',
    emptyTable: '当前表格为空。点击“新增行”创建第一个变量。',
    clickToEdit: '点击编辑',
    doubleClick: '双击选择',
    optionalComment: '可选备注',
    selectType: '选择类型',
    paginationTotal: (total: number) => `共 ${total} 条`,
    columns: {
      index: '序号',
      name: '名称',
      dataType: '数据类型',
      defaultValue: '默认值',
      comment: '备注',
    },
    aria: {
      summary: '表格摘要',
      editor: '变量表编辑器',
      index: (index: number) => `第 ${index + 1} 行序号`,
      name: (index: number) => `第 ${index + 1} 行名称`,
      dataType: (index: number) => `第 ${index + 1} 行数据类型`,
      defaultValue: (index: number) => `第 ${index + 1} 行默认值`,
      comment: (index: number) => `第 ${index + 1} 行备注`,
    },
  },
} as const;

/** domain 层校验规则返回英文稳定消息，这里维护对应的中文翻译。 */
const ZH_VALIDATION_MESSAGES: Record<string, string> = {
  'Name is required': '名称不能为空',
  'Name already exists': '名称已存在',
  'BOOL default value must be TRUE or FALSE': 'BOOL 默认值必须是 TRUE 或 FALSE',
  'INT default value must be an integer': 'INT 默认值必须是整数',
  'INT default value must be in range [-2147483648, 2147483647]':
    'INT 默认值范围必须是 [-2147483648, 2147483647]',
  'Select a data type before editing the default value': '请先选择数据类型，再编辑默认值',
};

/**
 * domain 层校验只返回稳定的英文消息；UI 层在展示边界做翻译，
 * 这样校验逻辑不会依赖 React、Ant Design 或具体语言环境。
 */
export function translateValidationMessage(message: string, language: Language) {
  return language === 'zh' ? (ZH_VALIDATION_MESSAGES[message] ?? message) : message;
}

/** 当前 UI 文案对象的类型，供组件 props 复用。 */
export type UiCopy = (typeof UI_COPY)[Language];
