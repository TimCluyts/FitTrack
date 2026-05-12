import {panelLabelStyle} from './goalPanelStyles';
import {goalSummary, currentActiveGoal} from '../../utils/goalPeriods';
import type {GoalPeriod} from '../../types/fitness';

interface GoalHistoryListProps {
	periods: GoalPeriod[];
	onDeletePeriod: (id: string) => void;
}

export function GoalHistoryList({periods, onDeletePeriod}: GoalHistoryListProps) {
	if (!periods.length) return null;

	const sorted = [...periods].sort((a, b) => b.from.localeCompare(a.from));
	const activePeriodId = currentActiveGoal(periods)?.id;

	return (
		<div
			style={{
				marginTop: '20px',
				borderTop: '1px solid rgba(255,255,255,0.12)',
				paddingTop: '16px'
			}}>
			<div style={{...panelLabelStyle, marginBottom: '10px'}}>Goal history</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
				{sorted.map(p => {
					const isCurrent = p.id === activePeriodId;
					return (
						<div
							key={p.id}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '10px',
								background: isCurrent ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
								borderRadius: '6px',
								padding: '8px 10px',
								fontSize: '12px',
								flexWrap: 'wrap'
							}}>
							<span
								style={{
									color: isCurrent ? '#68d391' : 'rgba(255,255,255,0.5)',
									fontWeight: 600,
									flexShrink: 0,
									minWidth: '76px'
								}}>
								{isCurrent ? '● ' : ''}from {p.from}
							</span>
							<span style={{color: 'rgba(255,255,255,0.7)', flex: 1}}>
								{goalSummary(p)}
							</span>
							{!isCurrent && (
								<button
									onClick={() => onDeletePeriod(p.id)}
									style={{
										background: 'none',
										border: 'none',
										color: 'rgba(255,255,255,0.35)',
										cursor: 'pointer',
										fontSize: '12px',
										fontFamily: 'inherit',
										padding: '0 2px',
										flexShrink: 0
									}}>
									Remove
								</button>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
