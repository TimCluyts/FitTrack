import {Button} from '../ui/Button';
import {DataTable} from '../ui/DataTable';
import {ServingBadge} from '../ServingBadge';
import type {Product} from '../../types/fitness';

interface ProductTableProps {
	products: Product[];
	onEdit: (product: Product) => void;
	onDelete: (id: string) => void;
}

const COLUMNS = [
	{label: 'Name', align: 'left' as const},
	{label: 'Serving', align: 'right' as const},
	{label: 'Kcal', align: 'right' as const},
	{label: 'Protein', align: 'right' as const},
	{label: 'Fat', align: 'right' as const},
	{label: 'Carbs', align: 'right' as const},
	{label: 'Actions', align: 'right' as const}
];

export function ProductTable({products, onEdit, onDelete}: ProductTableProps) {
	if (products.length === 0) return null;
	return (
		<DataTable columns={COLUMNS} minWidth={500}>
			{[...products]
				.sort((a, b) => a.name.localeCompare(b.name))
				.map(p => (
					<DataTable.Row key={p.id}>
						<DataTable.Cell>{p.name}</DataTable.Cell>
						<DataTable.Cell align="right">
							<ServingBadge product={p} />
						</DataTable.Cell>
						<DataTable.Cell align="right">{p.kcal}</DataTable.Cell>
						<DataTable.Cell align="right">
							{p.protein}g
						</DataTable.Cell>
						<DataTable.Cell align="right">{p.fat}g</DataTable.Cell>
						<DataTable.Cell align="right">
							{p.carbs}g
						</DataTable.Cell>
						<DataTable.Cell
							align="right"
							style={{whiteSpace: 'nowrap'}}>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onEdit(p)}>
								Edit
							</Button>{' '}
							<Button
								variant="ghost-danger"
								size="sm"
								onClick={() => {
									if (
										confirm(
											`Delete "${p.name}"? All its log entries will also be removed.`
										)
									)
										onDelete(p.id);
								}}>
								Delete
							</Button>
						</DataTable.Cell>
					</DataTable.Row>
				))}
		</DataTable>
	);
}
