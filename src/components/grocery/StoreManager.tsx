import {useState} from 'react';
import {useStores, useAddStore, useDeleteStore} from '../../hooks/useApi';
import {Card} from '../ui/Card';
import {Button} from '../ui/Button';

export function StoreManager() {
	const {data: stores = []} = useStores();
	const addStore = useAddStore();
	const deleteStore = useDeleteStore();
	const [newName, setNewName] = useState('');

	const handleAdd = () => {
		const name = newName.trim();
		if (!name) return;
		addStore.mutate({name});
		setNewName('');
	};

	return (
		<Card>
			<div style={{fontWeight: 600, fontSize: '15px', color: '#1b4332', marginBottom: '12px'}}>Stores</div>
			<div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px'}}>
				{stores.map(store => (
					<div
						key={store.id}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '6px',
							background: '#e8f4ee',
							borderRadius: '20px',
							padding: '5px 10px 5px 14px',
							fontSize: '13px',
							color: '#2d6a4f'
						}}>
						{store.name}
						<button
							onClick={() => deleteStore.mutate(store.id)}
							aria-label={`Remove ${store.name}`}
							style={{
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								color: '#a0aec0',
								fontSize: '16px',
								padding: '0',
								lineHeight: 1,
								display: 'flex',
								alignItems: 'center'
							}}>
							×
						</button>
					</div>
				))}
				{stores.length === 0 && (
					<span style={{fontSize: '13px', color: '#a0aec0'}}>No stores yet — add one below</span>
				)}
			</div>
			<div style={{display: 'flex', gap: '8px'}}>
				<input
					value={newName}
					onChange={e => setNewName(e.target.value)}
					onKeyDown={e => e.key === 'Enter' && handleAdd()}
					placeholder="Store name..."
					style={{
						flex: 1,
						padding: '8px 12px',
						fontSize: '14px',
						border: '1px solid #d1e7da',
						borderRadius: '6px',
						fontFamily: 'inherit',
						outline: 'none'
					}}
				/>
				<Button size="sm" onClick={handleAdd} disabled={!newName.trim()}>
					Add Store
				</Button>
			</div>
		</Card>
	);
}
