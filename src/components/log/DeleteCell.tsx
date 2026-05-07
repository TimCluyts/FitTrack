import {DataTable} from '../ui/DataTable';
import {Button} from '../ui/Button';

interface DeleteCellProps {
	id: string;
	onDelete: (id: string) => void;
}

export function DeleteCell({id, onDelete}: DeleteCellProps) {
	return (
		<DataTable.Cell align="right">
			<Button
				variant="ghost-danger"
				size="sm"
				onClick={() => onDelete(id)}
				style={{fontSize: '16px', padding: '2px 6px', lineHeight: 1}}
				title="Remove">
				×
			</Button>
		</DataTable.Cell>
	);
}
