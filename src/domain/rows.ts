import type { DataType, VariableRow } from './types';
import { getDefaultValueForDataType } from './validation';

/** 创建 AC 2 要求的空白新行。 */
export function createEmptyRow(id: string): VariableRow {
  return {
    id,
    name: '',
    dataType: '',
    defaultValue: '',
    comment: '',
  };
}

/**
 * 以不可变方式更新某一行的数据类型，并同步重置默认值。
 * 把这两个动作放在一起，可以避免出现 `dataType = INT` 但默认值仍是 BOOL 的 `TRUE` 这类不一致状态。
 */
export function updateRowDataType(
  rows: VariableRow[],
  rowId: string,
  dataType: Exclude<DataType, ''>,
): VariableRow[] {
  return rows.map((row) =>
    row.id === rowId
      ? {
          ...row,
          dataType,
          defaultValue: getDefaultValueForDataType(dataType),
        }
      : row,
  );
}
