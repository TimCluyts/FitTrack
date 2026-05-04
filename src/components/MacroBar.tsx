import type {DailyGoals, MacroTotals} from '../types/fitness';

function kcalColor(v: number, g?: DailyGoals): string {
	if (!g?.kcalMin && !g?.kcalMax) return 'white';
	if (g.kcalMax != null && v > g.kcalMax) return '#fc8181';
	if (g.kcalMin != null && v < g.kcalMin) return '#f6e05e';
	return '#68d391';
}

function minColor(v: number, min?: number): string {
	if (min == null) return 'white';
	return v >= min ? '#68d391' : '#f6e05e';
}

function maxColor(v: number, max?: number): string {
	if (max == null) return 'white';
	return v <= max ? '#68d391' : '#fc8181';
}

interface MacroBarProps extends MacroTotals {
	goals?: DailyGoals;
}

export function MacroBar({goals, ...totals}: MacroBarProps) {
	const items = [
		{
			key: 'kcal' as const,
			label: 'Kcal',
			value: String(totals.kcal),
			color: kcalColor(totals.kcal, goals),
			goalLabel:
				goals?.kcalMin != null || goals?.kcalMax != null
					? `${goals.kcalMin ?? '?'}–${goals.kcalMax ?? '?'}`
					: null
		},
		{
			key: 'protein' as const,
			label: 'Protein',
			value: `${totals.protein}g`,
			color: minColor(totals.protein, goals?.protein),
			goalLabel: goals?.protein != null ? `≥ ${goals.protein}g` : null
		},
		{
			key: 'fat' as const,
			label: 'Fat',
			value: `${totals.fat}g`,
			color: maxColor(totals.fat, goals?.fat),
			goalLabel: goals?.fat != null ? `≤ ${goals.fat}g` : null
		},
		{
			key: 'carbs' as const,
			label: 'Carbs',
			value: `${totals.carbs}g`,
			color: maxColor(totals.carbs, goals?.carbs),
			goalLabel: goals?.carbs != null ? `≤ ${goals.carbs}g` : null
		}
	];

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
					marginBottom: '14px'
				}}>
				Daily Totals
			</div>
			<div style={{display: 'flex', gap: '36px', flexWrap: 'wrap'}}>
				{items.map(({key, label, value, color, goalLabel}) => (
					<div key={key} style={{textAlign: 'center'}}>
						<div
							style={{
								color,
								fontSize: '30px',
								fontWeight: 700,
								lineHeight: 1
							}}>
							{value}
						</div>
						<div
							style={{
								color: 'rgba(255,255,255,0.6)',
								fontSize: '12px',
								marginTop: '4px',
								textTransform: 'uppercase',
								letterSpacing: '0.06em'
							}}>
							{label}
						</div>
						{goalLabel && (
							<div
								style={{
									color: 'rgba(255,255,255,0.45)',
									fontSize: '11px',
									marginTop: '2px'
								}}>
								{goalLabel}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
