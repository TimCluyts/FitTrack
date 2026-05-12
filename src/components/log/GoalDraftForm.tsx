import {panelInputStyle, panelLabelStyle} from './goalPanelStyles';
import type {DailyGoals} from '../../types/fitness';

const FIELDS: {key: keyof DailyGoals; label: string}[] = [
	{key: 'kcalMin', label: 'Kcal min'},
	{key: 'kcalMax', label: 'Kcal max'},
	{key: 'protein', label: 'Protein min (g)'},
	{key: 'fat', label: 'Fat max (g)'},
	{key: 'carbs', label: 'Carbs max (g)'}
];

interface GoalDraftFormProps {
	draft: DailyGoals;
	from: string;
	setFrom: (v: string) => void;
	setField: (key: keyof DailyGoals, value: string) => void;
	onSave: () => void;
	onCancel: () => void;
}

export function GoalDraftForm({draft, from, setFrom, setField, onSave, onCancel}: GoalDraftFormProps) {
	return (
		<>
			<div style={{marginBottom: '14px', maxWidth: '200px'}}>
				<div style={panelLabelStyle}>Effective from</div>
				<input
					type="date"
					value={from}
					onChange={e => setFrom(e.target.value)}
					style={panelInputStyle}
				/>
			</div>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
					gap: '10px'
				}}>
				{FIELDS.map(({key, label}) => (
					<div key={key}>
						<div style={panelLabelStyle}>{label}</div>
						<input
							type="number"
							min={0}
							value={draft[key] ?? ''}
							onChange={e => setField(key, e.target.value)}
							style={panelInputStyle}
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
		</>
	);
}
