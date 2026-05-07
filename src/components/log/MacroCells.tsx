import {DataTable} from '../ui/DataTable';
import type {MacroTotals} from '../../types/fitness';

export function MacroCells({kcal, protein, fat, carbs}: MacroTotals) {
	return (
		<>
			<DataTable.Cell align="right">{kcal}</DataTable.Cell>
			<DataTable.Cell align="right">{protein}g</DataTable.Cell>
			<DataTable.Cell align="right">{fat}g</DataTable.Cell>
			<DataTable.Cell align="right">{carbs}g</DataTable.Cell>
		</>
	);
}
