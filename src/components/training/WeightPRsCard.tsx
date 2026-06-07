import {Card} from '../ui/Card';
import {DataTable} from '../ui/DataTable';

const COLUMNS = [
	{label: 'Exercise', align: 'left' as const},
	{label: 'Best set', align: 'right' as const},
	{label: 'Est. 1RM', align: 'right' as const},
	{label: 'Achieved', align: 'right' as const}
];

export interface PR {
	exerciseId: string;
	name: string;
	weight: number;
	reps: number;
	oneRepMax: number;
	date: string;
}

interface WeightPRsCardProps {
	prs: PR[];
}

export function WeightPRsCard({prs}: Readonly<WeightPRsCardProps>) {
	return (
		<Card>
			<DataTable columns={COLUMNS} minWidth={420}>
				{prs.map(pr => (
					<DataTable.Row key={pr.exerciseId}>
						<DataTable.Cell>🏆 {pr.name}</DataTable.Cell>
						<DataTable.Cell align="right">
							{pr.weight} kg × {pr.reps}
						</DataTable.Cell>
						<DataTable.Cell align="right">{Math.round(pr.oneRepMax)} kg</DataTable.Cell>
						<DataTable.Cell align="right">{pr.date}</DataTable.Cell>
					</DataTable.Row>
				))}
			</DataTable>
		</Card>
	);
}
