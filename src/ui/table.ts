import Table from 'cli-table3';

type TableRow = Array<string | number>;

export function renderTable(headers: string[], rows: TableRow[]) {
  const table = new Table({ head: headers });
  rows.forEach((row) => table.push(row));
  return table.toString();
}
