import {useState} from 'react';
import {useProducts, useStores, useAddPrice} from '../../hooks/useApi';
import {Card} from '../ui/Card';
import {Button} from '../ui/Button';

function today() {
	return new Date().toISOString().slice(0, 10);
}

const inputStyle: React.CSSProperties = {
	padding: '8px 10px',
	fontSize: '14px',
	border: '1px solid #d1e7da',
	borderRadius: '6px',
	fontFamily: 'inherit',
	outline: 'none',
	width: '100%',
	boxSizing: 'border-box'
};

const selectStyle: React.CSSProperties = {
	...inputStyle,
	background: 'white',
	cursor: 'pointer'
};

export function PriceEntryForm() {
	const {data: products = []} = useProducts();
	const {data: stores = []} = useStores();
	const addPrice = useAddPrice();

	const [productId, setProductId] = useState('');
	const [storeId, setStoreId] = useState('');
	const [price, setPrice] = useState('');
	const [date, setDate] = useState(today());
	const [unit, setUnit] = useState('');

	const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
	const canSubmit = productId && storeId && price && Number(price) > 0;

	const handleSubmit = () => {
		if (!canSubmit) return;
		addPrice.mutate({
			productId,
			storeId,
			price: parseFloat(price),
			date,
			...(unit.trim() ? {unit: unit.trim()} : {})
		});
		setPrice('');
		setUnit('');
	};

	if (stores.length === 0) {
		return (
			<Card style={{color: '#718096', fontSize: '14px'}}>
				Add at least one store above before logging prices.
			</Card>
		);
	}

	return (
		<Card>
			<div style={{fontWeight: 600, fontSize: '15px', color: '#1b4332', marginBottom: '16px'}}>Log Price</div>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
					gap: '12px'
				}}>
				<label style={{display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#4a5568'}}>
					Product
					<select value={productId} onChange={e => setProductId(e.target.value)} style={selectStyle}>
						<option value="">Select product...</option>
						{sortedProducts.map(p => (
							<option key={p.id} value={p.id}>
								{p.name}
							</option>
						))}
					</select>
				</label>
				<label style={{display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#4a5568'}}>
					Store
					<select value={storeId} onChange={e => setStoreId(e.target.value)} style={selectStyle}>
						<option value="">Select store...</option>
						{stores.map(s => (
							<option key={s.id} value={s.id}>
								{s.name}
							</option>
						))}
					</select>
				</label>
				<label style={{display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#4a5568'}}>
					Price (€)
					<input
						type="number"
						min="0"
						step="0.01"
						value={price}
						onChange={e => setPrice(e.target.value)}
						placeholder="0.00"
						style={inputStyle}
					/>
				</label>
				<label style={{display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#4a5568'}}>
					Date
					<input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
				</label>
				<label style={{display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#4a5568'}}>
					<span>
						Unit <span style={{color: '#a0aec0', fontWeight: 400, fontSize: '12px'}}>(optional)</span>
					</span>
					<input
						value={unit}
						onChange={e => setUnit(e.target.value)}
						placeholder="e.g. per 100g, per kg"
						style={inputStyle}
					/>
				</label>
			</div>
			<div style={{marginTop: '16px'}}>
				<Button onClick={handleSubmit} disabled={!canSubmit}>
					Add Price
				</Button>
			</div>
		</Card>
	);
}
