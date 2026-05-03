import {useState} from 'react';
import {Card} from '../ui/Card';
import {Button} from '../ui/Button';
import {Field} from '../ui/Field';
import type {DailyGoals} from '../../store/goalsStore';

interface GoalsCardProps {
	goals?: DailyGoals;
	onSave: (goals: DailyGoals) => void;
}

function Chip({children}: {children: React.ReactNode}) {
	return (
		<span
			style={{
				fontSize: '12px',
				background: '#f0f7f4',
				color: '#2d6a4f',
				borderRadius: '4px',
				padding: '3px 8px'
			}}>
			{children}
		</span>
	);
}

export function GoalsCard({goals, onSave}: GoalsCardProps) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState<DailyGoals>(goals ?? {});

	const hasGoals = goals && Object.values(goals).some(v => v != null);

	const handleSave = () => {
		onSave(draft);
		setEditing(false);
	};

	const handleEdit = () => {
		setDraft(goals ?? {});
		setEditing(true);
	};

	const numField = (
		key: keyof DailyGoals,
		label: string
	) => (
		<Field>
			<Field.Label>{label}</Field.Label>
			<Field.Input
				type="number"
				min={0}
				value={draft[key] ?? ''}
				onChange={e =>
					setDraft(d => ({
						...d,
						[key]: e.target.value ? Number(e.target.value) : undefined
					}))
				}
			/>
		</Field>
	);

	if (editing) {
		return (
			<Card>
				<div
					style={{
						fontWeight: 600,
						fontSize: '13px',
						color: '#1b4332',
						textTransform: 'uppercase',
						letterSpacing: '0.04em',
						marginBottom: '12px'
					}}>
					Daily Goals
				</div>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
						gap: '8px'
					}}>
					{numField('kcalMin', 'Kcal min')}
					{numField('kcalMax', 'Kcal max')}
					{numField('protein', 'Protein min (g)')}
					{numField('fat', 'Fat max (g)')}
					{numField('carbs', 'Carbs max (g)')}
				</div>
				<div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
					<Button onClick={handleSave}>Save</Button>
					<Button variant="outline" onClick={() => setEditing(false)}>
						Cancel
					</Button>
				</div>
			</Card>
		);
	}

	return (
		<Card>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}>
				<div
					style={{
						fontWeight: 600,
						fontSize: '13px',
						color: '#1b4332',
						textTransform: 'uppercase',
						letterSpacing: '0.04em'
					}}>
					Daily Goals
				</div>
				<Button variant="outline" size="sm" onClick={handleEdit}>
					{hasGoals ? 'Edit' : 'Set goals'}
				</Button>
			</div>
			{hasGoals && (
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '6px',
						marginTop: '10px'
					}}>
					{(goals.kcalMin != null || goals.kcalMax != null) && (
						<Chip>
							{goals.kcalMin ?? '?'}–{goals.kcalMax ?? '?'} kcal
						</Chip>
					)}
					{goals.protein != null && (
						<Chip>≥ {goals.protein}g protein</Chip>
					)}
					{goals.fat != null && <Chip>≤ {goals.fat}g fat</Chip>}
					{goals.carbs != null && <Chip>≤ {goals.carbs}g carbs</Chip>}
				</div>
			)}
		</Card>
	);
}
