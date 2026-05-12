import {DataTable} from '../ui/DataTable';
import {MacroCells} from './MacroCells';
import {DeleteCell} from './DeleteCell';
import type {LogEntry} from '../../types/fitness';

interface CustomEntryRowProps {
	entry: LogEntry;
	onDelete: (id: string) => void;
}

export function CustomEntryRow({entry, onDelete}: CustomEntryRowProps) {
	const c = entry.customEntry;
	if (!c) return null;
	return (
		<DataTable.Row>
			<DataTable.Cell>
				<span
					style={{
						fontSize: '11px',
						background: '#fff3e0',
						color: '#b45309',
						borderRadius: '3px',
						padding: '1px 5px',
						marginRight: '6px'
					}}>
					custom
				</span>
				{c.name}
			</DataTable.Cell>
			<DataTable.Cell align="right">—</DataTable.Cell>
			<MacroCells kcal={c.kcal} protein={c.protein} fat={c.fat} carbs={c.carbs} />
			<DeleteCell id={entry.id} onDelete={onDelete} />
		</DataTable.Row>
	);
}
