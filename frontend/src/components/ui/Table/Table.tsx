import { tableStyle, thStyle, tdStyle } from "./Table.styles";
import type { TableProps } from "./Table.types";

export default function Table<T>({ columns, data, rowKey, emptyMessage = "Nenhum item encontrado." }: TableProps<T>) {
  if (data.length === 0) {
    return <p className="ui-empty-state">{emptyMessage}</p>;
  }

  return (
    <div className="ui-table-shell">
      <table className="ui-table" style={tableStyle}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="ui-table__head" style={{ ...thStyle, ...col.style }}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={rowKey(item)} className="ui-table__row">
            {columns.map((col) => (
              <td key={col.key} className="ui-table__cell" style={{ ...tdStyle, ...col.style }}>{col.render(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}
