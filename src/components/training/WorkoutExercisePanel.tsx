import {Button} from '../ui/Button';
import {WorkoutSetRow} from './WorkoutSetRow';
import type {DraftSet} from '../../types/fitness';
import type {WorkoutSet} from '../../types/fitness';

interface WorkoutExercisePanelProps {
	name: string;
	lastSets: WorkoutSet[] | null;
	pr?: number | null;
	progressBadge?: number | null;
	sets: DraftSet[];
	isDone: boolean;
	onUpdateSet: (
		setIdx: number,
		field: 'weight' | 'reps',
		value: string
	) => void;
	onAddSet: () => void;
	onRemoveSet: (setIdx: number) => void;
	onToggleDone: () => void;
}

const SET_HEADERS = ['#', 'Weight (kg)', 'Reps', ''];

export function WorkoutExercisePanel({
	name,
	lastSets,
	pr,
	progressBadge,
	sets,
	isDone,
	onUpdateSet,
	onAddSet,
	onRemoveSet,
	onToggleDone
}: Readonly<WorkoutExercisePanelProps>) {
	if (isDone) {
		const filledSets = sets.filter(s => s.weight !== '' && s.reps !== '');
		const summary = filledSets
			.map(s => `${s.weight}×${s.reps}`)
			.join(' · ');
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '12px',
					padding: '10px 0',
					borderBottom: '1px solid #e8f0e9',
					opacity: 0.75
				}}>
				<div>
					<div
						style={{
							fontWeight: 600,
							fontSize: '14px',
							color: '#1b4332',
							display: 'flex',
							alignItems: 'center',
							gap: '6px'
						}}>
						<span style={{color: '#2d6a4f'}}>✓</span> {name}
					</div>
					{summary && (
						<div
							style={{
								fontSize: '12px',
								color: '#718096',
								marginTop: '2px'
							}}>
							{summary}
						</div>
					)}
				</div>
				<Button variant="outline" size="sm" onClick={onToggleDone}>
					Edit
				</Button>
			</div>
		);
	}

	const prevHint = lastSets
		?.slice(0, 4)
		.map(s => `${s.weight}×${s.reps}`)
		.join(' · ');

	return (
		<div>
			<div
				style={{
					fontWeight: 600,
					fontSize: '14px',
					color: '#1b4332',
					marginBottom: '2px'
				}}>
				{name}
			</div>
			{progressBadge != null && (
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '4px',
						fontSize: '11px',
						fontWeight: 700,
						color: '#fff',
						background: '#dd6b20',
						borderRadius: '4px',
						padding: '2px 8px',
						marginBottom: '4px'
					}}>
					↑ Increase weight — last: {progressBadge} kg
				</div>
			)}
			{(prevHint || pr != null) && (
				<div
					style={{
						fontSize: '12px',
						color: '#a0aec0',
						marginBottom: '8px',
						display: 'flex',
						gap: '10px',
						flexWrap: 'wrap'
					}}>
					{prevHint && <span>Last: {prevHint}</span>}
					{pr != null && (
						<span style={{color: '#d69e2e', fontWeight: 600}}>
							🏆 PR: {pr} kg
						</span>
					)}
				</div>
			)}

			<div style={{overflowX: 'auto'}}>
				<table
					style={{
						width: '100%',
						borderCollapse: 'collapse',
						fontSize: '13px'
					}}>
					<thead>
						<tr>
							{SET_HEADERS.map((h, i) => (
								<th
									key={i}
									style={{
										textAlign:
											i === 0 || i === 3
												? 'center'
												: 'left',
										padding: '4px 8px',
										color: '#718096',
										fontWeight: 600,
										fontSize: '11px',
										textTransform: 'uppercase',
										letterSpacing: '0.04em',
										borderBottom: '1px solid #e8f0e9'
									}}>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{sets.map((s, setIdx) => (
							<WorkoutSetRow
								key={setIdx}
								index={setIdx}
								set={s}
								canRemove={sets.length > 1}
								onUpdate={(field, value) =>
									onUpdateSet(setIdx, field, value)
								}
								onRemove={() => onRemoveSet(setIdx)}
							/>
						))}
					</tbody>
				</table>
			</div>

			<div style={{display: 'flex', gap: '8px', marginTop: '6px'}}>
				<Button
					variant="outline"
					size="sm"
					onClick={onAddSet}
					style={{fontSize: '12px'}}>
					+ Set
				</Button>
				<Button
					size="sm"
					onClick={onToggleDone}
					style={{fontSize: '12px'}}>
					Done
				</Button>
			</div>
		</div>
	);
}
