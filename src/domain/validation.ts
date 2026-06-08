import type { DataType, VariableRow } from './types';

/** 32 位有符号整数下界。 */
export const INT_MIN = -2147483648n;
/** 32 位有符号整数上界。 */
export const INT_MAX = 2147483647n;

export type ValidationResult =
  | { ok: true; value: string }
  | { ok: false; message: string };

/**
 * 根据验收标准校验变量名：
 * - 空值不允许保存
 * - 与其他行重复的名称不允许保存，且大小写不敏感
 * - 当前行可以保留自己的原名称
 */
export function validateVariableName(
  input: string,
  rows: VariableRow[],
  currentRowId: string,
): ValidationResult {
  const value = input.trim();

  if (!value) {
    return { ok: false, message: 'Name is required' };
  }

  const duplicate = rows.some(
    (row) =>
      row.id !== currentRowId &&
      row.name.trim().toLocaleLowerCase() === value.toLocaleLowerCase(),
  );

  if (duplicate) {
    return { ok: false, message: 'Name already exists' };
  }

  return { ok: true, value };
}

/**
 * BOOL 只接受 true/false，输入大小写不敏感；保存时统一转成大写，
 * 以满足题目要求的统一展示格式。
 */
export function validateBoolDefaultValue(input: string): ValidationResult {
  const value = input.trim().toLocaleLowerCase();

  if (value === 'true') {
    return { ok: true, value: 'TRUE' };
  }

  if (value === 'false') {
    return { ok: true, value: 'FALSE' };
  }

  return { ok: false, message: 'BOOL default value must be TRUE or FALSE' };
}

/**
 * INT 只接受整数字符串，并进一步校验 32 位有符号整数范围。
 * 使用 BigInt 是为了安全比较超大输入，避免 JavaScript Number 精度溢出。
 */
export function validateIntDefaultValue(input: string): ValidationResult {
  const value = input.trim();

  if (!/^-?\d+$/.test(value)) {
    return { ok: false, message: 'INT default value must be an integer' };
  }

  const parsed = BigInt(value);

  if (parsed < INT_MIN || parsed > INT_MAX) {
    return {
      ok: false,
      message: 'INT default value must be in range [-2147483648, 2147483647]',
    };
  }

  return { ok: true, value: parsed.toString() };
}

/** 根据当前行选择的数据类型分发默认值校验逻辑。 */
export function validateDefaultValue(
  dataType: DataType,
  input: string,
): ValidationResult {
  if (dataType === 'BOOL') {
    return validateBoolDefaultValue(input);
  }

  if (dataType === 'INT') {
    return validateIntDefaultValue(input);
  }

  return { ok: false, message: 'Select a data type before editing the default value' };
}

/** 数据类型切换后需要自动写入的默认值。 */
export function getDefaultValueForDataType(dataType: DataType): string {
  if (dataType === 'BOOL') {
    return 'TRUE';
  }

  if (dataType === 'INT') {
    return '0';
  }

  return '';
}
