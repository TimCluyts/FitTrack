interface Option<T extends string> {
	value: T;
	label: string;
}

interface ModeToggleProps<T extends string> {
	options: readonly Option<T>[];
	value: T;
	onChange: (value: T) => void;
}

export function ModeToggle<T extends string>({
	options,
	value,
	onChange
}: ModeToggleProps<T>) {
	return (
		<div
			style={{
				display: 'inline-flex',
				border: '1px solid #d1d9d1',
				borderRadius: '6px',
				overflow: 'hidden'
			}}>
			{options.map(opt => (
				<button
					key={opt.value}
					onClick={() => onChange(opt.value)}
					style={{
						padding: '6px 20px',
						fontSize: '13px',
						border: 'none',
						cursor: 'pointer',
						fontFamily: 'inherit',
						background: value === opt.value ? '#2d6a4f' : 'white',
						color: value === opt.value ? 'white' : '#4a5568',
						fontWeight: value === opt.value ? 600 : 400
					}}>
					{opt.label}
				</button>
			))}
		</div>
	);
}
