import {useState} from 'react';
import {Button} from '../ui/Button';
import {DataTable} from '../ui/DataTable';
import {Field} from '../ui/Field';
import {IngredientAmountInput} from '../ServingInput';
import {ProductCombobox} from '../ProductCombobox';
import {useProducts} from '../../hooks/useApi';

interface AddIngredientRowProps {
	onAdd: (productId: string, amount: string) => void;
}

export function AddIngredientRow({onAdd}: AddIngredientRowProps) {
	const {data: products = []} = useProducts();
	const [productId, setProductId] = useState('');
	const [amount, setAmount] = useState('');
	const activeProduct = products.find(p => p.id === productId);

	const handleAdd = () => {
		const parsed = parseFloat(amount);
		if (!productId || !parsed || parsed <= 0) return;
		onAdd(productId, amount);
		setAmount('');
	};

	return (
		<tr>
			<DataTable.Cell colSpan={7} style={{padding: '12px 0 4px'}}>
				<div
					style={{
						display: 'flex',
						gap: '8px',
						flexWrap: 'wrap',
						alignItems: 'flex-start'
					}}>
					<div style={{flex: '2 1 180px'}}>
						<ProductCombobox
							products={products}
							value={productId}
							onChange={id => {
								setProductId(id);
								setAmount('');
							}}
						/>
					</div>
					<div style={{flex: '1 1 130px'}}>
						<IngredientAmountInput
							product={activeProduct}
							value={amount}
							onChange={setAmount}
							onEnter={handleAdd}
						/>
					</div>
					<Button
						variant="secondary"
						onClick={handleAdd}
						disabled={!productId || !amount}
						style={{alignSelf: 'flex-start'}}>
						+ Add
					</Button>
				</div>
			</DataTable.Cell>
		</tr>
	);
}
