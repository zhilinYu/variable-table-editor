import { describe, expect, it } from 'vitest';
import type { VariableRow } from './types';
import {
  getDefaultValueForDataType,
  validateBoolDefaultValue,
  validateDefaultValue,
  validateIntDefaultValue,
  validateVariableName,
} from './validation';
import { updateRowDataType } from './rows';

function row(id: string, name: string): VariableRow {
  return {
    id,
    name,
    dataType: '',
    defaultValue: '',
    comment: '',
  };
}

describe('validateVariableName', () => {
  it('rejects empty names', () => {
    expect(validateVariableName('   ', [row('1', 'counter')], '1')).toEqual({
      ok: false,
      message: 'Name is required',
    });
  });

  it('rejects duplicate names case-insensitively', () => {
    expect(validateVariableName('Counter', [row('1', 'counter'), row('2', '')], '2')).toEqual({
      ok: false,
      message: 'Name already exists',
    });
  });

  it('allows the current row to keep its own name', () => {
    expect(validateVariableName('Counter', [row('1', 'counter')], '1')).toEqual({
      ok: true,
      value: 'Counter',
    });
  });
});

describe('validateBoolDefaultValue', () => {
  it('accepts true and false case-insensitively and normalizes display', () => {
    expect(validateBoolDefaultValue('true')).toEqual({ ok: true, value: 'TRUE' });
    expect(validateBoolDefaultValue('FALSE')).toEqual({ ok: true, value: 'FALSE' });
    expect(validateBoolDefaultValue(' false ')).toEqual({ ok: true, value: 'FALSE' });
  });

  it('rejects non-boolean values', () => {
    expect(validateBoolDefaultValue('yes')).toEqual({
      ok: false,
      message: 'BOOL default value must be TRUE or FALSE',
    });
  });
});

describe('validateIntDefaultValue', () => {
  it('accepts integers inside the signed 32-bit range', () => {
    expect(validateIntDefaultValue('42')).toEqual({ ok: true, value: '42' });
    expect(validateIntDefaultValue('-2147483648')).toEqual({
      ok: true,
      value: '-2147483648',
    });
    expect(validateIntDefaultValue('2147483647')).toEqual({
      ok: true,
      value: '2147483647',
    });
  });

  it('rejects non-integers', () => {
    expect(validateIntDefaultValue('3.14')).toEqual({
      ok: false,
      message: 'INT default value must be an integer',
    });
  });

  it('rejects integers outside the signed 32-bit range', () => {
    expect(validateIntDefaultValue('9999999999')).toEqual({
      ok: false,
      message: 'INT default value must be in range [-2147483648, 2147483647]',
    });
  });
});

describe('validateDefaultValue', () => {
  it('routes default value validation by data type', () => {
    expect(validateDefaultValue('BOOL', 'false')).toEqual({ ok: true, value: 'FALSE' });
    expect(validateDefaultValue('INT', '0')).toEqual({ ok: true, value: '0' });
  });

  it('requires a selected data type before editing a default value', () => {
    expect(validateDefaultValue('', 'true')).toEqual({
      ok: false,
      message: 'Select a data type before editing the default value',
    });
  });
});

describe('data type default values', () => {
  it('returns the expected default value for each data type', () => {
    expect(getDefaultValueForDataType('BOOL')).toBe('TRUE');
    expect(getDefaultValueForDataType('INT')).toBe('0');
    expect(getDefaultValueForDataType('')).toBe('');
  });

  it('resets the default value when a row data type changes', () => {
    const rows: VariableRow[] = [
      {
        id: '1',
        name: 'Start',
        dataType: 'BOOL',
        defaultValue: 'TRUE',
        comment: '',
      },
    ];

    expect(updateRowDataType(rows, '1', 'INT')).toEqual([
      {
        id: '1',
        name: 'Start',
        dataType: 'INT',
        defaultValue: '0',
        comment: '',
      },
    ]);
  });
});
