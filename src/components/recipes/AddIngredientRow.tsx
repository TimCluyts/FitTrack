import {useState} from 'react';
import {Button} from '../ui/Button';
import {DataTable} from '../ui/DataTable';
import {Field} from '../ui/Field';
import {IngredientAmountInput} from '../ServingInput';
import {useNutritionStore} from '../../store/nutritionStore';

interface AddIngredientRowProps {
	onAdd: (productId: string, amount: string) => void;
}

export function AddIngredientRow({onAdd}: AddIngredientRowProps) {
	const {products} = useNutritionStore();
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
					<Field style={{flex: '2 1 180px'}}>
						<Field.Select
							value={productId}
							onChange={e => {
								setProductId(e.target.value);
								setAmount('');
							}}>
							<option value="">Add ingredient…</option>
							{[...products]
								.sort((a, b) => a.name.localeCompare(b.name))
								.map(p => (
									<option key={p.id} value={p.id}>
										{p.name}
										{p.servingSize
											? ` · 1 ${p.servingLabel ?? 'serving'} = ${p.servingSize}g`
											: ''}
									</option>
								))}
						</Field.Select>
					</Field>
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
