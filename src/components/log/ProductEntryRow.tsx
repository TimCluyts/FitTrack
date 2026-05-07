import {DataTable} from '../ui/DataTable';
import {calcMacros} from '../../utils/macros';
import {displayAmount} from '../../utils/serving';
import {AmountCell} from './AmountCell';
import {MacroCells} from './MacroCells';
import {DeleteCell} from './DeleteCell';
import type {LogEntry, Product} from '../../types/fitness';

interface ProductEntryRowProps {
	entry: LogEntry;
	products: Product[];
	onDelete: (id: string) => void;
	onUpdate: (id: string, amount: number) => void;
}

export function ProductEntryRow({entry, products, onDelete, onUpdate}: ProductEntryRowProps) {
	const product = products.find(p => p.id === entry.productId);
	if (!product) return null;
	const m = calcMacros(product, entry.amount ?? 0);
	return (
		<DataTable.Row>
			<DataTable.Cell>{product.name}</DataTable.Cell>
			<AmountCell
				display={displayAmount(entry.amount ?? 0, product)}
				amount={entry.amount ?? 0}
				product={product}
				onSave={v => onUpdate(entry.id, v)}
			/>
			<MacroCells {...m} />
			<DeleteCell id={entry.id} onDelete={onDelete} />
		</DataTable.Row>
	);
}
