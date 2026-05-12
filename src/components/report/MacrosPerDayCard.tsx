import {Card} from '../ui/Card';
import {useMacrosView, type MacroViewMode} from '../../hooks/useMacrosView';
import {useActiveGoal} from '../../hooks/useApi';
import {MACROS} from './macroConfig';
import {MacroStackedChart} from './MacroStackedChart';
import {MacroLinesChart} from './MacroLinesChart';
import type {MacroDayPoint} from './macroConfig';

interface MacrosPerDayCardProps {
	data: MacroDayPoint[];
}

const VIEW_LABELS: Record<MacroViewMode, string> = {stacked: 'Stacked', lines: 'Lines'};

export function MacrosPerDayCard({data}: MacrosPerDayCardProps) {
	const {view, setView, active, toggleMacro} = useMacrosView();
	const activeGoal = useActiveGoal();

	return (
		<Card>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '12px'
				}}>
				<div style={{fontWeight: 600, fontSize: '15px', color: '#1b4332'}}>
					Macros per day (g)
				</div>
				<div style={{display: 'flex', gap: '4px'}}>
					{(['stacked', 'lines'] as MacroViewMode[]).map(v => (
						<button
							key={v}
							onClick={() => setView(v)}
							style={{
								padding: '4px 12px',
								fontSize: '12px',
								fontWeight: view === v ? 600 : 400,
								background: view === v ? '#2d6a4f' : 'transparent',
								color: view === v ? 'white' : '#4a7c59',
								border: view === v ? 'none' : '1px solid #b7d9c5',
								borderRadius: '5px',
								cursor: 'pointer',
								fontFamily: 'inherit'
							}}>
							{VIEW_LABELS[v]}
						</button>
					))}
				</div>
			</div>

			{view === 'lines' && (
				<div style={{display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap'}}>
					{MACROS.map(m => (
						<button
							key={m.key}
							onClick={() => toggleMacro(m.key)}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '5px',
								padding: '4px 12px',
								fontSize: '12px',
								fontWeight: active[m.key] ? 600 : 400,
								background: active[m.key] ? m.color : '#f0f4f0',
								color: active[m.key] ? 'white' : '#718096',
								border: 'none',
								borderRadius: '20px',
								cursor: 'pointer',
								fontFamily: 'inherit',
								transition: 'all 0.15s ease'
							}}>
							{active[m.key] && <span style={{fontSize: '10px'}}>●</span>}
							{m.label}
							{activeGoal?.[m.goalKey] != null && (
								<span style={{fontSize: '10px', opacity: active[m.key] ? 0.8 : 0.5}}>
									{m.goalPrefix}{activeGoal[m.goalKey]}g
								</span>
							)}
						</button>
					))}
				</div>
			)}

			{view === 'stacked' ? (
				<MacroStackedChart data={data} />
			) : (
				<MacroLinesChart data={data} active={active} />
			)}
		</Card>
	);
}
