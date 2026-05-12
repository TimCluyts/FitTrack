import {GoalDraftForm} from './GoalDraftForm';
import {GoalHistoryList} from './GoalHistoryList';
import type {DailyGoals, GoalPeriod} from '../../types/fitness';

interface GoalsEditPanelProps {
	periods: GoalPeriod[];
	draft: DailyGoals;
	from: string;
	setFrom: (v: string) => void;
	setField: (key: keyof DailyGoals, value: string) => void;
	onSave: () => void;
	onCancel: () => void;
	onDeletePeriod: (id: string) => void;
}

export function GoalsEditPanel({
	periods,
	draft,
	from,
	setFrom,
	setField,
	onSave,
	onCancel,
	onDeletePeriod
}: GoalsEditPanelProps) {
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
				Set New Goals
			</div>
			<GoalDraftForm
				draft={draft}
				from={from}
				setFrom={setFrom}
				setField={setField}
				onSave={onSave}
				onCancel={onCancel}
			/>
			<GoalHistoryList periods={periods} onDeletePeriod={onDeletePeriod} />
		</div>
	);
}
