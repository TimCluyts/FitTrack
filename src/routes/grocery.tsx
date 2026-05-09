import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {PageHeader} from '../components/ui/PageHeader';
import {StoreManager} from '../components/grocery/StoreManager';
import {PriceEntryForm} from '../components/grocery/PriceEntryForm';
import {PriceTable} from '../components/grocery/PriceTable';
import {PriceCompareChart} from '../components/grocery/PriceCompareChart';

export const Route = createFileRoute('/grocery')({
	component: GroceryPage
});

function TabButton({
	active,
	onClick,
	children
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			onClick={onClick}
			style={{
				padding: '8px 20px',
				fontSize: '14px',
				fontWeight: active ? 600 : 400,
				background: active ? '#2d6a4f' : 'transparent',
				color: active ? 'white' : '#4a7c59',
				border: active ? 'none' : '1px solid #b7d9c5',
				borderRadius: '6px',
				cursor: 'pointer',
				fontFamily: 'inherit'
			}}>
			{children}
		</button>
	);
}

function GroceryPage() {
	const [tab, setTab] = useState<'prices' | 'compare'>('prices');

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Grocery Prices" />

			<div style={{display: 'flex', gap: '6px'}}>
				<TabButton active={tab === 'prices'} onClick={() => setTab('prices')}>
					Prices
				</TabButton>
				<TabButton active={tab === 'compare'} onClick={() => setTab('compare')}>
					Compare Stores
				</TabButton>
			</div>

			{tab === 'prices' && (
				<>
					<StoreManager />
					<PriceEntryForm />
					<PriceTable />
				</>
			)}

			{tab === 'compare' && <PriceCompareChart />}
		</div>
	);
}
