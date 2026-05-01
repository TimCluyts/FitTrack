import {Field} from '../ui/Field';
import {MEAL_TIMES, type MealTime} from '../../types/fitness';

interface MealSelectProps {
	value: MealTime;
	onChange: (v: MealTime) => void;
}

export function MealSelect({value, onChange}: MealSelectProps) {
	return (
		<Field style={{flex: '1 1 150px'}}>
			<Field.Label>Meal time</Field.Label>
			<Field.Select
				value={value}
				onChange={e => onChange(e.target.value as MealTime)}>
				{MEAL_TIMES.map(m => (
					<option key={m.value} value={m.value}>
						{m.label}
					</option>
				))}
			</Field.Select>
		</Field>
	);
}
