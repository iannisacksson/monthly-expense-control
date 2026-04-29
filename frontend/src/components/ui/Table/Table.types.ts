import type { ReactNode, CSSProperties } from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  style?: CSSProperties;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (item: T) => string;
  emptyMessage?: string;
}
