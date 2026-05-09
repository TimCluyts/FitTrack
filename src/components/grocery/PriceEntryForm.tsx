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
	const [isPromo, setIsPromo] = useState(false);
	const [regularPrice, setRegularPrice] = useState('');

	const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
	const canSubmit = productId && storeId && price && Number(price) > 0;

	const handleSubmit = () => {
		if (!canSubmit) return;
		const reg = parseFloat(regularPrice);
		addPrice.mutate({
			productId,
			storeId,
			price: parseFloat(price),
			date,
			...(unit.trim() ? {unit: unit.trim()} : {}),
			...(isPromo ? {isPromo: true} : {}),
			...(isPromo && reg > 0 ? {regularPrice: reg} : {})
		});
		setPrice('');
		setUnit('');
		setIsPromo(false);
		setRegularPrice('');
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

			<div style={{marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
				<button
					type="button"
					onClick={() => {
						setIsPromo(p => !p);
						if (isPromo) setRegularPrice('');
					}}
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px',
						padding: '7px 14px',
						borderRadius: '20px',
						border: isPromo ? 'none' : '1.5px dashed #c0d9ca',
						background: isPromo ? 'linear-gradient(135deg, #e76f51, #f4a261)' : 'transparent',
						color: isPromo ? 'white' : '#718096',
						fontSize: '13px',
						fontWeight: isPromo ? 600 : 400,
						fontFamily: 'inherit',
						cursor: 'pointer',
						transition: 'all 0.15s ease',
						userSelect: 'none',
						flexShrink: 0
					}}>
					<span
						style={{
							width: '16px',
							height: '16px',
							borderRadius: '50%',
							background: isPromo ? 'rgba(255,255,255,0.35)' : '#e2e8f0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '11px',
							flexShrink: 0
						}}>
						{isPromo ? '✓' : '%'}
					</span>
					<span>Promotional price</span>
				</button>

				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '10px',
						background: '#fff5f0',
						border: '1px solid #fdd0bc',
						borderRadius: '10px',
						padding: '6px 12px',
						visibility: isPromo ? 'visible' : 'hidden'
					}}>
					<span style={{fontSize: '13px', color: '#c05621', fontWeight: 500, whiteSpace: 'nowrap'}}>
						Regular price (€)
					</span>
					<input
						type="number"
						min="0"
						step="0.01"
						value={regularPrice}
						onChange={e => setRegularPrice(e.target.value)}
						placeholder="0.00"
						tabIndex={isPromo ? 0 : -1}
						style={{
							padding: '5px 9px',
							fontSize: '14px',
							border: '1px solid #fbb6a0',
							borderRadius: '6px',
							fontFamily: 'inherit',
							outline: 'none',
							width: '90px',
							background: 'white'
						}}
					/>
				</div>
			</div>

			<div style={{marginTop: '14px'}}>
				<Button onClick={handleSubmit} disabled={!canSubmit}>
					Add Price
				</Button>
			</div>
		</Card>
	);
}
