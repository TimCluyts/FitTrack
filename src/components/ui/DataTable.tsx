import type {CSSProperties, ReactNode} from 'react';

const thStyle: CSSProperties = {
	padding: '8px',
	fontSize: '11px',
	fontWeight: 600,
	color: '#718096',
	borderBottom: '2px solid #e8f0e9',
	textTransform: 'uppercase',
	letterSpacing: '0.04em'
};

function DataTableRow({children}: {children: ReactNode}) {
	return <tr style={{borderBottom: '1px solid #f0f4f0'}}>{children}</tr>;
}

function DataTableCell({
	align = 'left',
	children,
	style,
	colSpan
}: {
	align?: 'left' | 'right';
	children?: ReactNode;
	style?: CSSProperties;
	colSpan?: number;
}) {
	return (
		<td
			colSpan={colSpan}
			style={{
				padding: '10px 8px',
				fontSize: '14px',
				textAlign: align,
				...style
			}}>
			{children}
		</td>
	);
}

function DataTableRoot({
	columns,
	children,
	minWidth
}: {
	columns: {label: string; align?: 'left' | 'right'}[];
	children: ReactNode;
	minWidth?: number;
}) {
	return (
		<div style={{overflowX: 'auto'}}>
			<table
				style={{
					width: '100%',
					borderCollapse: 'collapse',
					minWidth: minWidth ? `${minWidth}px` : undefined
				}}>
				<thead>
					<tr>
						{columns.map((col, i) => (
							<th
								key={i}
								style={{
									...thStyle,
									textAlign:
										col.align ??
										(i === 0 ? 'left' : 'right')
								}}>
								{col.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>{children}</tbody>
			</table>
		</div>
	);
}

export const DataTable = Object.assign(DataTableRoot, {
	Row: DataTableRow,
	Cell: DataTableCell
});
