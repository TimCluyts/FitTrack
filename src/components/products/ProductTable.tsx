import {useState} from 'react';
import {Button} from '../ui/Button';
import {DataTable} from '../ui/DataTable';
import {ServingBadge} from '../ServingBadge';
import {calcMacros} from '../../utils/macros';
import type {Product} from '../../types/fitness';

interface ProductTableProps {
	products: Product[];
	onEdit: (product: Product) => void;
	onDelete: (id: string) => void;
	favoriteIds?: string[];
	onToggleFavorite?: (id: string) => void;
}

type MacroMode = '100g' | 'serving';

const COLUMNS = [
	{label: 'Name', align: 'left' as const},
	{label: 'Serving', align: 'right' as const},
	{label: 'Kcal', align: 'right' as const},
	{label: 'Protein', align: 'right' as const},
	{label: 'Fat', align: 'right' as const},
	{label: 'Carbs', align: 'right' as const},
	{label: 'Actions', align: 'right' as const}
];

function MacroToggle({mode, onChange}: {mode: MacroMode; onChange: (m: MacroMode) => void}) {
	const btn = (_label: string, value: MacroMode) => ({
		onClick: () => onChange(value),
		style: {
			padding: '4px 10px',
			fontSize: '12px',
			fontWeight: mode === value ? 600 : 400,
			background: mode === value ? '#2d6a4f' : 'white',
			color: mode === value ? 'white' : '#4a5568',
			border: '1px solid #e2e8f0',
			cursor: 'pointer',
			transition: 'all 0.15s'
		} as const
	});

	return (
		<div
			style={{
				display: 'inline-flex',
				borderRadius: '6px',
				overflow: 'hidden',
				border: '1px solid #e2e8f0'
			}}>
			<button {...btn('per 100g', '100g')}>per 100g</button>
			<button
				{...btn('per serving', 'serving')}
				style={{
					...btn('per serving', 'serving').style,
					borderLeft: 'none'
				}}>
				per serving
			</button>
		</div>
	);
}

export function ProductTable({products, onEdit, onDelete, favoriteIds = [], onToggleFavorite}: ProductTableProps) {
	const [mode, setMode] = useState<MacroMode>('100g');

	if (products.length === 0) return null;

	const hasAnyServing = products.some(p => p.servingSize);

	return (
		<div>
			{hasAnyServing && (
				<div style={{marginBottom: '12px'}}>
					<MacroToggle mode={mode} onChange={setMode} />
				</div>
			)}
			<DataTable columns={COLUMNS} minWidth={500}>
				{[...products]
					.sort((a, b) => a.name.localeCompare(b.name))
					.map(p => {
						const macros =
							mode === 'serving' && p.servingSize
								? calcMacros(p, p.servingSize)
								: null;
						const noServing = mode === 'serving' && !p.servingSize;

						return (
							<DataTable.Row key={p.id}>
								<DataTable.Cell>{p.name}</DataTable.Cell>
								<DataTable.Cell align="right">
									<ServingBadge product={p} />
								</DataTable.Cell>
								<DataTable.Cell align="right">
									{noServing ? '—' : (macros?.kcal ?? p.kcal)}
								</DataTable.Cell>
								<DataTable.Cell align="right">
									{noServing ? '—' : `${macros?.protein ?? p.protein}g`}
								</DataTable.Cell>
								<DataTable.Cell align="right">
									{noServing ? '—' : `${macros?.fat ?? p.fat}g`}
								</DataTable.Cell>
								<DataTable.Cell align="right">
									{noServing ? '—' : `${macros?.carbs ?? p.carbs}g`}
								</DataTable.Cell>
								<DataTable.Cell
									align="right"
									style={{whiteSpace: 'nowrap'}}>
									{onToggleFavorite && (() => {
										const isFav = favoriteIds.includes(p.id);
										return (
											<button
												onClick={() => onToggleFavorite(p.id)}
												title={isFav ? 'Remove from favorites' : 'Add to favorites'}
												style={{
													background: 'none',
													border: 'none',
													cursor: 'pointer',
													fontSize: '16px',
													padding: '2px 4px',
													color: isFav ? '#d69e2e' : '#cbd5e0',
													lineHeight: 1
												}}>
												★
											</button>
										);
									})()}{' '}
									<Button
										variant="outline"
										size="sm"
										onClick={() => onEdit(p)}>
										Edit
									</Button>{' '}
									<Button
										variant="ghost-danger"
										size="sm"
										onClick={() => {
											if (
												confirm(
													`Delete "${p.name}"? All its log entries will also be removed.`
												)
											)
												onDelete(p.id);
										}}>
										Delete
									</Button>
								</DataTable.Cell>
							</DataTable.Row>
						);
					})}
			</DataTable>
		</div>
	);
}
