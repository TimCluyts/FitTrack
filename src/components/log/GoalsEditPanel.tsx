import type {DailyGoals} from '../../types/fitness';

const FIELDS: {key: keyof DailyGoals; label: string}[] = [
	{key: 'kcalMin', label: 'Kcal min'},
	{key: 'kcalMax', label: 'Kcal max'},
	{key: 'protein', label: 'Protein min (g)'},
	{key: 'fat', label: 'Fat max (g)'},
	{key: 'carbs', label: 'Carbs max (g)'}
];

interface GoalsEditPanelProps {
	draft: DailyGoals;
	setField: (key: keyof DailyGoals, value: string) => void;
	onSave: () => void;
	onCancel: () => void;
}

export function GoalsEditPanel({draft, setField, onSave, onCancel}: GoalsEditPanelProps) {
	return (
		<div
			style={{
				background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
				borderRadius: '8px',
				padding: '20px 24px',
				boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
			}}>
			<div
				style={{
					fontSize: '11px',
					fontWeight: 600,
					color: 'rgba(255,255,255,0.6)',
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
					marginBottom: '16px'
				}}>
				Edit Daily Goals
			</div>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
					gap: '10px'
				}}>
				{FIELDS.map(({key, label}) => (
					<div key={key}>
						<div
							style={{
								fontSize: '11px',
								color: 'rgba(255,255,255,0.55)',
								marginBottom: '5px',
								fontWeight: 500,
								textTransform: 'uppercase',
								letterSpacing: '0.04em'
							}}>
							{label}
						</div>
						<input
							type="number"
							min={0}
							value={draft[key] ?? ''}
							onChange={e => setField(key, e.target.value)}
							style={{
								width: '100%',
								padding: '8px 10px',
								background: 'rgba(255,255,255,0.12)',
								border: '1px solid rgba(255,255,255,0.2)',
								borderRadius: '6px',
								color: 'white',
								fontSize: '14px',
								outline: 'none',
								fontFamily: 'inherit',
								boxSizing: 'border-box'
							}}
						/>
					</div>
				))}
			</div>

			<div style={{display: 'flex', gap: '8px', marginTop: '18px'}}>
				<button
					onClick={onSave}
					style={{
						padding: '8px 20px',
						background: 'rgba(255,255,255,0.18)',
						border: '1px solid rgba(255,255,255,0.3)',
						borderRadius: '6px',
						color: 'white',
						fontSize: '14px',
						fontWeight: 600,
						cursor: 'pointer',
						fontFamily: 'inherit'
					}}>
					Save
				</button>
				<button
					onClick={onCancel}
					style={{
						padding: '8px 20px',
						background: 'transparent',
						border: '1px solid rgba(255,255,255,0.15)',
						borderRadius: '6px',
						color: 'rgba(255,255,255,0.6)',
						fontSize: '14px',
						cursor: 'pointer',
						fontFamily: 'inherit'
					}}>
					Cancel
				</button>
			</div>
		</div>
	);
}
