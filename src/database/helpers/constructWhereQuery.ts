import { QueryOptions } from 'src/lib/types/types';
import { and, getTableColumns, SQL, Table, type SQLWrapper } from 'drizzle-orm';
import { COMPARISON_OPERATORS } from 'src/lib/constants';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
// import { Column } from "postgres";
import { TableConfig } from 'drizzle-orm/pg-core';

interface Options<T, C extends TableConfig>
  extends Pick<QueryOptions<T>, 'filters' | 'operators'> {
  table: PgTableWithColumns<C>;
  strict?: boolean;
}

export const constructWhereQuery = <
  T extends Record<string, unknown>,
  C extends TableConfig,
>({
  table,
  filters = {},
  strict = false,
  operators = {},
}: Options<T, C>): SQL<unknown> | undefined => {
  const filterKeys = Object.keys(filters) as unknown as keyof ReturnType<
    typeof getTableColumns<Table>
  >;
  const tableColumns = getTableColumns(table);
  // Throw an error if no query options are provided and strict mode is enabled
  if (filterKeys.length === 0) {
    if (strict)
      throw new Error(`Query options are empty: ${JSON.stringify(filters)}`);
    return;
  }

  const conditions: SQLWrapper[] = [];
  for (const column of filterKeys) {
    const operatorName = operators[column] ?? 'eq'; // Default to "eq" if no operator is specified
    const value = filters[column as keyof T];
    const operator = COMPARISON_OPERATORS[operatorName];
    if (!operator) {
      throw new Error(`Invalid operator: ${operatorName}`);
    }
    if (!tableColumns[column]) {
      continue;
    }
    // Apply the operator to the table column and value
    conditions.push(operator(table[column], value as string));
  }
  if (conditions.length === 1) {
    return conditions[0] as SQL<unknown>;
  }
  return and(...conditions) as SQL<unknown>;
};

/**
 * Formats number/string fields of an object into `%value%` for SQL LIKE queries.
 * @param obj - The object containing fields to format.
 * @param fieldsToFormat - An array of keys to format (optional). If not provided, all string fields will be formatted.
 * @returns A new object with the specified fields formatted or the object itself if number of fields is 0.
 */
export const formatObjectLikeQuery = <
  T extends Record<string, string | number>,
>(
  obj: T,
  ...fieldsToFormat: (keyof T)[]
): T => {
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return obj;
  }
  const formattedObj = { ...obj };

  // Determine which fields to format
  const keysToFormat = fieldsToFormat.length > 0 ? fieldsToFormat : keys;

  for (const key of keysToFormat) {
    const value = obj[key];
    if (typeof value === 'string' || typeof value === 'number') {
      // Format the value if it's a string or number
      formattedObj[key] = `%${value}%` as T[keyof T];
    }
  }
  return formattedObj;
};
