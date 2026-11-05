export default function DataTable({ columns, rows, caption, emptyMessage = 'No records found.' }) {
  return <div className="table-scroll" role="region" aria-label={caption} tabIndex={0}>
    <table><caption className="sr-only">{caption}</caption><thead><tr>{columns.map(column => <th scope="col" key={column.key}>{column.label}</th>)}</tr></thead>
      <tbody>{rows.map(row => <tr key={row.id}>{columns.map(column => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}</tr>)}</tbody>
    </table>{!rows.length && <p className="empty-state" role="status">{emptyMessage}</p>}
  </div>;
}
