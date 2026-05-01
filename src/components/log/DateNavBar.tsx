import {Button} from '../ui/Button';
import {Card} from '../ui/Card';
import {Field} from '../ui/Field';

interface DateNavBarProps {
	date: string;
	label: string;
	isToday: boolean;
	onPrev: () => void;
	onNext: () => void;
	onDateChange: (date: string) => void;
	onToday: () => void;
}

export function DateNavBar({
	date,
	label,
	isToday,
	onPrev,
	onNext,
	onDateChange,
	onToday
}: DateNavBarProps) {
	return (
		<Card>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '12px'
				}}>
				<Button variant="outline" size="sm" onClick={onPrev}>
					← Prev
				</Button>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '10px',
						flexWrap: 'wrap',
						justifyContent: 'center'
					}}>
					<Field.Input
						type="date"
						value={date}
						onChange={e => onDateChange(e.target.value)}
						style={{width: 'auto', fontWeight: 500}}
					/>
					<span
						style={{
							fontSize: '14px',
							color: '#555',
							minWidth: '90px',
							textAlign: 'center'
						}}>
						{label}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={isToday}
						onClick={onToday}>
						Today
					</Button>
				</div>
				<Button variant="outline" size="sm" onClick={onNext}>
					Next →
				</Button>
			</div>
		</Card>
	);
}
