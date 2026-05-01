import type {MacroTotals} from '../types/fitness';

const ITEMS = [
	{key: 'kcal' as const, label: 'Kcal', format: (v: number) => String(v)},
	{key: 'protein' as const, label: 'Protein', format: (v: number) => `${v}g`},
	{key: 'fat' as const, label: 'Fat', format: (v: number) => `${v}g`},
	{key: 'carbs' as const, label: 'Carbs', format: (v: number) => `${v}g`}
];

export function MacroBar(totals: MacroTotals) {
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
				{ITEMS.map(({key, label, format}) => (
					<div key={key} style={{textAlign: 'center'}}>
						<div
							style={{
								color: 'white',
								fontSize: '30px',
								fontWeight: 700,
								lineHeight: 1
							}}>
							{format(totals[key])}
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
					</div>
				))}
			</div>
		</div>
	);
}
