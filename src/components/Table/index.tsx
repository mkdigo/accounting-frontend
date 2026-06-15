import styles from './styles.module.css';

type TTextAlign = 'left' | 'center' | 'right';

type RootProps = React.TableHTMLAttributes<HTMLTableElement> & {
  head?: string[];
  rows?: Array<string | number | null | undefined>[];
  textAlign?: TTextAlign[];
};

function Root({ head, rows, textAlign, children, ...props }: RootProps) {
  return (
    <table {...props} className={`${styles.table} ${props.className}`}>
      {head && (
        <thead>
          <tr>
            {head.map((item, i) => (
              <th
                key={`head-${i}`}
                style={{
                  textAlign: textAlign ? (textAlign[i] ?? 'center') : 'center',
                }}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows &&
          rows.map((row, i) => (
            <tr key={`row-${i}`}>
              {row.map((column, j) => (
                <td
                  key={`root-column-${j}`}
                  style={{
                    textAlign: textAlign
                      ? (textAlign[i] ?? 'center')
                      : 'center',
                  }}
                >
                  {column ?? ''}
                </td>
              ))}
            </tr>
          ))}
        {children}
      </tbody>
    </table>
  );
}

type RowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  columns?: Array<string | number | null | undefined>;
};

function Row({ columns, children, ...props }: RowProps) {
  return (
    <tr {...props}>
      {columns &&
        columns.map((column, i) => <td key={`column-${i}`}>{column ?? ''}</td>)}
      {children}
    </tr>
  );
}

type ColumnProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  textAlign?: TTextAlign;
};

function Column({ children, textAlign, ...props }: ColumnProps) {
  return (
    <td {...props} style={{ textAlign: textAlign ?? 'center' }}>
      {children}
    </td>
  );
}

export const Table = {
  Root,
  Row,
  Column,
};
