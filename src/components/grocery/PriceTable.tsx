import {useState} from 'react';
import {useProducts, useStores, usePrices, useDeletePrice} from '../../hooks/useApi';
import {Card} from '../ui/Card';

const thStyle: React.CSSProperties = {
	textAlign: 'left',
	padding: '8px 12px',
	fontWeight: 600,
	color: '#4a5568',
	fontSize: '13px',
	whiteSpace: 'nowrap'
};

const tdStyle: React.CSSProperties = {
	padding: '9px 12px',
	color: '#2d3748',
	fontSize: '14px'
};

const filterSelectStyle: React.CSSProperties = {
	padding: '7px 10px',
	fontSize: '13px',
	border: '1px solid #d1e7da',
	borderRadius: '6px',
	fontFamily: 'inherit',
	background: 'white',
	cursor: 'pointer',
	outline: 'none'
};

export function PriceTable() {
	const {data: products = []} = useProducts();
	const {data: stores = []} = useStores();
	const {data: prices = []} = usePrices();
	const deletePrice = useDeletePrice();

	const [filterProduct, setFilterProduct] = useState('');
	const [filterStore, setFilterStore] = useState('');

	if (prices.length === 0) return null;

	const productMap = Object.fromEntries(products.map(p => [p.id, p.name]));
	const storeMap = Object.fromEntries(stores.map(s => [s.id, s.name]));

	const filtered = [...prices]
		.filter(p => !filterProduct || p.productId === filterProduct)
		.filter(p => !filterStore || p.storeId === filterStore)
		.sort((a, b) => b.date.localeCompare(a.date));

	return (
		<Card>
			<div style={{fontWeight: 600, fontSize: '15px', color: '#1b4332', marginBottom: '12px'}}>
				Price History
			</div>
			<div style={{display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap'}}>
				<select value={filterProduct} onChange={e => setFilterProduct(e.target.value)} style={filterSelectStyle}>
					<option value="">All products</option>
					{[...products]
						.sort((a, b) => a.name.localeCompare(b.name))
						.map(p => (
							<option key={p.id} value={p.id}>
								{p.name}
							</option>
						))}
				</select>
				<select value={filterStore} onChange={e => setFilterStore(e.target.value)} style={filterSelectStyle}>
					<option value="">All stores</option>
					{stores.map(s => (
						<option key={s.id} value={s.id}>
							{s.name}
						</option>
					))}
				</select>
			</div>
			<div style={{overflowX: 'auto'}}>
				<table style={{width: '100%', borderCollapse: 'collapse'}}>
					<thead>
						<tr style={{borderBottom: '2px solid #e8f4ee'}}>
							<th style={thStyle}>Date</th>
							<th style={thStyle}>Product</th>
							<th style={thStyle}>Store</th>
							<th style={thStyle}>Price</th>
							<th style={thStyle}>Unit</th>
							<th style={thStyle} />
						</tr>
					</thead>
					<tbody>
						{filtered.map(entry => (
							<tr key={entry.id} style={{borderBottom: '1px solid #f0f4f0'}}>
								<td style={tdStyle}>{entry.date}</td>
								<td style={tdStyle}>{productMap[entry.productId] ?? '—'}</td>
								<td style={tdStyle}>{storeMap[entry.storeId] ?? '—'}</td>
								<td style={{...tdStyle, fontWeight: 600}}>€{entry.price.toFixed(2)}</td>
								<td style={{...tdStyle, color: '#718096'}}>{entry.unit ?? ''}</td>
								<td style={{...tdStyle, textAlign: 'right'}}>
									<button
										onClick={() => deletePrice.mutate(entry.id)}
										style={{
											background: 'none',
											border: 'none',
											cursor: 'pointer',
											color: '#c53030',
											fontSize: '13px',
											padding: '2px 6px',
											borderRadius: '4px',
											fontFamily: 'inherit'
										}}>
										Delete
									</button>
								</td>
							</tr>
						))}
						{filtered.length === 0 && (
							<tr>
								<td
									colSpan={6}
									style={{...tdStyle, textAlign: 'center', color: '#a0aec0', padding: '20px'}}>
									No entries match the filter
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</Card>
	);
}
