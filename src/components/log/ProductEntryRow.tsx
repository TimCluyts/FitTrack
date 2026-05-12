import {useState} from 'react';
import {DataTable} from '../ui/DataTable';
import {Button} from '../ui/Button';
import {calcMacros} from '../../utils/macros';
import {displayAmount} from '../../utils/serving';
import {useConvertToCustom} from '../../hooks/useConvertToCustom';
import {AmountCell} from './AmountCell';
import {MacroCells} from './MacroCells';
import {ConvertConfirmRow} from './ConvertConfirmRow';
import type {LogEntry, Product} from '../../types/fitness';

interface ProductEntryRowProps {
	readonly entry: LogEntry;
	readonly products: Product[];
	readonly onDelete: (id: string) => void;
	readonly onUpdate: (id: string, amount: number) => void;
}

export function ProductEntryRow({entry, products, onDelete, onUpdate}: Readonly<ProductEntryRowProps>) {
	const product = products.find(p => p.id === entry.productId);
	const [hovering, setHovering] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [alsoDeleteProduct, setAlsoDeleteProduct] = useState(false);
	const {convert} = useConvertToCustom(entry, product);

	if (!product) return null;
	const m = calcMacros(product, entry.amount ?? 0);

	const dismiss = () => {
		setConfirming(false);
		setAlsoDeleteProduct(false);
	};

	return (
		<>
			<DataTable.Row
				onMouseEnter={() => setHovering(true)}
				onMouseLeave={() => setHovering(false)}>
				<DataTable.Cell>{product.name}</DataTable.Cell>
				<AmountCell
					display={displayAmount(entry.amount ?? 0, product)}
					amount={entry.amount ?? 0}
					product={product}
					onSave={v => onUpdate(entry.id, v)}
				/>
				<MacroCells {...m} />
				<DataTable.Cell align="right" style={{width: '100px', minWidth: '100px'}}>
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px'}}>
						{(hovering || confirming) && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => setConfirming(c => !c)}
								style={{fontSize: '11px', padding: '1px 5px', color: '#b45309', borderColor: '#b45309'}}
								title="Convert to custom entry">
								↓ custom
							</Button>
						)}
						<Button
							variant="ghost-danger"
							size="sm"
							onClick={() => onDelete(entry.id)}
							style={{fontSize: '16px', padding: '2px 6px', lineHeight: 1}}
							title="Remove">
							×
						</Button>
					</div>
				</DataTable.Cell>
			</DataTable.Row>
			{confirming && (
				<ConvertConfirmRow
					productName={product.name}
					alsoDeleteProduct={alsoDeleteProduct}
					onAlsoDeleteChange={setAlsoDeleteProduct}
					onConfirm={() => convert({alsoDeleteProduct, onDone: dismiss})}
					onCancel={dismiss}
				/>
			)}
		</>
	);
}
