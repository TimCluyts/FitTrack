import {useEffect, useMemo, useRef, useState} from 'react';
import type {CSSProperties} from 'react';
import {Field} from './ui/Field';
import {useProducts} from '../hooks/useApi';
import {calcRecipeTotalMacros, calcRecipeTotalWeight} from '../utils/macros';
import type {Recipe} from '../types/fitness';

interface RecipeComboboxProps {
	recipes: Recipe[];
	value: string;
	onChange: (id: string) => void;
}

function recipeKcalPer100g(recipe: Recipe, products: ReturnType<typeof useProducts>['data']): number | null {
	if (recipe.simpleMacros) return recipe.simpleMacros.kcal;
	const prods = products ?? [];
	const totalWeight = calcRecipeTotalWeight(recipe);
	if (totalWeight === 0) return null;
	const totals = calcRecipeTotalMacros(recipe, prods);
	return Math.round((totals.kcal / totalWeight) * 100);
}

export function RecipeCombobox({recipes, value, onChange}: RecipeComboboxProps) {
	const {data: products} = useProducts();
	const selected = recipes.find(r => r.id === value);
	const [search, setSearch] = useState('');
	const [open, setOpen] = useState(false);
	const [dropdownPos, setDropdownPos] = useState<CSSProperties>({});
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!value) setSearch('');
		else if (selected) setSearch(selected.name);
	}, [value, selected]);

	const filtered = useMemo(
		() =>
			[...recipes]
				.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
				.sort((a, b) => a.name.localeCompare(b.name)),
		[recipes, search]
	);

	const handleFocus = () => {
		if (containerRef.current) {
			const r = containerRef.current.getBoundingClientRect();
			setDropdownPos({position: 'fixed', top: r.bottom + 2, left: r.left, width: r.width});
		}
		setSearch('');
		setOpen(true);
	};

	const handleBlur = () =>
		setTimeout(() => {
			setOpen(false);
			setSearch(selected?.name ?? '');
		}, 150);

	const handleChange = (v: string) => {
		setSearch(v);
		if (!v) onChange('');
	};

	const handleSelect = (id: string) => {
		onChange(id);
		setOpen(false);
	};

	return (
		<div ref={containerRef} style={{position: 'relative'}}>
			<Field.Input
				type="text"
				value={open ? search : (selected?.name ?? '')}
				onChange={e => handleChange(e.target.value)}
				onFocus={handleFocus}
				onBlur={handleBlur}
				placeholder="Type to search recipes…"
			/>
			{open && (
				<div
					style={{
						...dropdownPos,
						background: 'white',
						border: '1px solid #d1d9d1',
						borderRadius: '6px',
						boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
						maxHeight: '220px',
						overflowY: 'auto',
						zIndex: 1000
					}}>
					{filtered.length === 0 ? (
						<div style={{padding: '10px 12px', fontSize: '13px', color: '#a0aec0'}}>
							No recipes match
						</div>
					) : (
						filtered.map(r => {
							const kcal = recipeKcalPer100g(r, products);
							return (
								<button
									key={r.id}
									onMouseDown={() => handleSelect(r.id)}
									style={{
										display: 'block',
										width: '100%',
										padding: '8px 12px',
										textAlign: 'left',
										background: r.id === value ? '#f0f7f4' : 'transparent',
										border: 'none',
										borderBottom: '1px solid #f7fafc',
										cursor: 'pointer',
										fontSize: '14px',
										color: '#2d3748',
										fontFamily: 'inherit'
									}}>
									<span style={{fontWeight: r.id === value ? 600 : 400}}>
										{r.name}
									</span>
									{r.simpleMacros && (
										<span style={{fontSize: '11px', background: '#fef3c7', color: '#92400e', borderRadius: '3px', padding: '1px 4px', marginLeft: '6px'}}>
											quick
										</span>
									)}
									{kcal !== null && (
										<span style={{fontSize: '12px', color: '#718096', marginLeft: '8px'}}>
											{kcal} kcal/100g
										</span>
									)}
								</button>
							);
						})
					)}
				</div>
			)}
		</div>
	);
}
