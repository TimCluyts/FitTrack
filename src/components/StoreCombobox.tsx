import {useEffect, useMemo, useRef, useState} from 'react';
import type {CSSProperties} from 'react';
import {Field} from './ui/Field';
import type {Store} from '../types/fitness';

interface StoreComboboxProps {
	stores: Store[];
	value: string;
	onChange: (id: string) => void;
	placeholder?: string;
}

export function StoreCombobox({stores, value, onChange, placeholder = 'Type to search stores…'}: StoreComboboxProps) {
	const selected = stores.find(s => s.id === value);
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
			[...stores]
				.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
				.sort((a, b) => a.name.localeCompare(b.name)),
		[stores, search]
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
				placeholder={placeholder}
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
							No stores match
						</div>
					) : (
						filtered.map(s => (
							<button
								key={s.id}
								onMouseDown={() => handleSelect(s.id)}
								style={{
									display: 'block',
									width: '100%',
									padding: '8px 12px',
									textAlign: 'left',
									background: s.id === value ? '#f0f7f4' : 'transparent',
									border: 'none',
									borderBottom: '1px solid #f7fafc',
									cursor: 'pointer',
									fontSize: '14px',
									color: '#2d3748',
									fontFamily: 'inherit',
									fontWeight: s.id === value ? 600 : 400
								}}>
								{s.name}
							</button>
						))
					)}
				</div>
			)}
		</div>
	);
}
