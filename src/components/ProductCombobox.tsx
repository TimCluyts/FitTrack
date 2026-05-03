import {useEffect, useMemo, useRef, useState} from 'react';
import type {CSSProperties} from 'react';
import {Field} from './ui/Field';
import type {Product} from '../types/fitness';

interface ProductComboboxProps {
	products: Product[];
	value: string;
	onChange: (id: string) => void;
}

export function ProductCombobox({products, value, onChange}: ProductComboboxProps) {
	const selected = products.find(p => p.id === value);
	const [search, setSearch] = useState('');
	const [open, setOpen] = useState(false);
	const [dropdownPos, setDropdownPos] = useState<CSSProperties>({});
	const containerRef = useRef<HTMLDivElement>(null);

	// Keep input text in sync when an external change clears the selection
	useEffect(() => {
		if (!value) setSearch('');
		else if (selected) setSearch(selected.name);
	}, [value, selected]);

	const filtered = useMemo(
		() =>
			[...products]
				.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
				.sort((a, b) => a.name.localeCompare(b.name)),
		[products, search]
	);

	const handleFocus = () => {
		if (containerRef.current) {
			const r = containerRef.current.getBoundingClientRect();
			setDropdownPos({
				position: 'fixed',
				top: r.bottom + 2,
				left: r.left,
				width: r.width
			});
		}
		setSearch('');
		setOpen(true);
	};

	// Delay so mouseDown on an option fires before blur closes the list
	const handleBlur = () =>
		setTimeout(() => {
			setOpen(false);
			if (selected) setSearch(selected.name);
			else setSearch('');
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
				placeholder="Type to search products…"
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
						<div
							style={{
								padding: '10px 12px',
								fontSize: '13px',
								color: '#a0aec0'
							}}>
							No products match
						</div>
					) : (
						filtered.map(p => (
							<button
								key={p.id}
								onMouseDown={() => handleSelect(p.id)}
								style={{
									display: 'block',
									width: '100%',
									padding: '8px 12px',
									textAlign: 'left',
									background: p.id === value ? '#f0f7f4' : 'transparent',
									border: 'none',
									borderBottom: '1px solid #f7fafc',
									cursor: 'pointer',
									fontSize: '14px',
									color: '#2d3748',
									fontFamily: 'inherit'
								}}>
								<span style={{fontWeight: p.id === value ? 600 : 400}}>
									{p.name}
								</span>
								<span
									style={{
										fontSize: '12px',
										color: '#718096',
										marginLeft: '8px'
									}}>
									{p.kcal} kcal/100g
									{p.servingSize
										? ` · 1 ${p.servingLabel ?? 'serving'} = ${p.servingSize}g`
										: ''}
								</span>
							</button>
						))
					)}
				</div>
			)}
		</div>
	);
}
