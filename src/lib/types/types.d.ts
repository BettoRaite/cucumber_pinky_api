import { COMPARISON_OPERATORS } from '../constants';

export type UserJWT = {
  id: number;
};
/**
 * Represents pagination settings for a query.
 */
export type PaginationOptions = {
  itemsPerPage?: number; // Renamed from `pageSize`
  pageStart?: number; // Renamed from `pageStart`
};

/**
 * Represents the names of comparison operators.
 */
export type ComparisonOperator = keyof typeof COMPARISON_OPERATORS;

/**
 * Maps fields of type `T` to comparison operators.
 */
export type FieldOperators<T> = Partial<Record<keyof T, ComparisonOperator>>;

/**
 * Represents sorting options for a query.
 */
export type SortingOptions<T> = {
  ascending?: readonly (keyof T)[]; // Renamed from `asc`
  descending?: readonly (keyof T)[]; // Renamed from `desc`
};

/**
 * Represents the configuration for a query.
 */
export type QueryOptions<T> = {
  filters?: Partial<T>; // Renamed from `queryOptions`
  operators?: FieldOperators<T>; // Renamed from `operators`
  sorting?: SortingOptions<T>; // Renamed from `sorting`
  pagination?: PaginationOptions; // Renamed from `pagination`
};
