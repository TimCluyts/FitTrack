import {DataTable} from '../ui/DataTable';
import {Button} from '../ui/Button';

interface ConvertConfirmRowProps {
	readonly productName: string;
	readonly alsoDeleteProduct: boolean;
	readonly onAlsoDeleteChange: (v: boolean) => void;
	readonly onConfirm: () => void;
	readonly onCancel: () => void;
}

export function ConvertConfirmRow({
	productName,
	alsoDeleteProduct,
	onAlsoDeleteChange,
	onConfirm,
	onCancel
}: ConvertConfirmRowProps) {
	return (
		<DataTable.Row>
			<DataTable.Cell colSpan={7} style={{background: '#fffbf5', padding: '8px 12px'}}>
				<div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
					<span style={{fontSize: '13px', color: '#78350f'}}>
						Convert <strong>{productName}</strong> to a custom entry?
					</span>
					<label
						style={{
							display: 'flex',
							gap: '5px',
							alignItems: 'center',
							fontSize: '13px',
							color: '#4a5568',
							cursor: 'pointer'
						}}>
						<input
							type="checkbox"
							checked={alsoDeleteProduct}
							onChange={e => onAlsoDeleteChange(e.target.checked)}
						/>
						Also remove from products list
					</label>
					<div style={{display: 'flex', gap: '6px', marginLeft: 'auto'}}>
						<Button size="sm" onClick={onConfirm}>
							Convert
						</Button>
						<Button variant="outline" size="sm" onClick={onCancel}>
							Cancel
						</Button>
					</div>
				</div>
			</DataTable.Cell>
		</DataTable.Row>
	);
}
