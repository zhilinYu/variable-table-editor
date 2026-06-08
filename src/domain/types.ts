/**
 * 支持的变量数据类型。
 *
 * 空字符串表示用户尚未选择类型。它属于 UI 草稿态的一部分，
 * 因为题目要求新增行的所有字段都默认为空。
 */
export type DataType = '' | 'BOOL' | 'INT';

/** 变量表中的一行可编辑数据。 */
export interface VariableRow {
  /** 内部稳定 key，供 React/Ant Design 使用；展示用 Index 是派生值。 */
  id: string;
  /** 变量名，必填，并且需要大小写不敏感地保持唯一。 */
  name: string;
  /** 从支持的数据类型中选择的变量类型。 */
  dataType: DataType;
  /** 以字符串保存，因为单元格内容在校验前都是文本输入。 */
  defaultValue: string;
  /** 自由文本备注；空值也是合法值。 */
  comment: string;
}

/** 可编辑的业务字段；自动生成的 Index 列不属于可编辑字段。 */
export type EditableField = 'name' | 'dataType' | 'defaultValue' | 'comment';
