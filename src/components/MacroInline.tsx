import type {MacroTotals} from '../types/fitness';

export function MacroInline({kcal, protein, fat, carbs}: MacroTotals) {
	return (
		<span style={{fontSize: '13px', color: '#718096'}}>
			{kcal} kcal · {protein}g prot · {fat}g fat · {carbs}g carbs
		</span>
	);
}
