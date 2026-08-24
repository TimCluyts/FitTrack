import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {PageHeader} from '../components/ui/PageHeader';
import {Card} from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import {ChecklistPicker} from '../components/checklists/ChecklistPicker';
import {ChecklistCard} from '../components/checklists/ChecklistCard';
import {CHECKLIST_TEMPLATES} from '../components/checklists/templates';
import {accent} from '../components/checklists/styles';
import {useChecklists, useAddChecklist} from '../hooks/useApi';

export const Route = createFileRoute('/checklists')({
	component: ChecklistsPage
});

function EmptyState({onCreate}: {onCreate: (index: number) => void}) {
	return (
		<Card style={{borderTop: `3px solid ${accent.main}`, textAlign: 'center'}}>
			<div style={{fontSize: '32px', marginBottom: '8px'}}>📋</div>
			<div style={{fontWeight: 600, color: accent.deep, marginBottom: '6px'}}>
				No checklists yet
			</div>
			<div style={{fontSize: '14px', color: accent.muted, marginBottom: '16px'}}>
				Reusable lists you tick off and reset for the next time.
			</div>
			<div style={{display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap'}}>
				{CHECKLIST_TEMPLATES.map((template, i) => (
					<Button
						key={template.label}
						size="sm"
						onClick={() => onCreate(i)}
						style={{background: accent.main}}>
						Start with {template.label}
					</Button>
				))}
			</div>
		</Card>
	);
}

function ChecklistsPage() {
	const {data: checklists = [], isLoading} = useChecklists();
	const addChecklist = useAddChecklist();
	const [selectedId, setSelectedId] = useState<string | null>(null);

	// Fall back to the first list whenever the selection is gone (deleted, or
	// nothing picked yet).
	const selected =
		checklists.find(c => c.id === selectedId) ?? checklists[0] ?? null;

	const createFromTemplate = (index: number) => {
		const template = CHECKLIST_TEMPLATES[index];
		if (!template) return;
		addChecklist.mutate(template.draft, {
			onSuccess: created => setSelectedId(created.id)
		});
	};

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Checklists" />

			{!isLoading && (
				<ChecklistPicker
					checklists={checklists}
					selectedId={selected?.id ?? null}
					onSelect={setSelectedId}
				/>
			)}

			{!isLoading && checklists.length === 0 && (
				<EmptyState onCreate={createFromTemplate} />
			)}

			{selected && (
				<ChecklistCard
					key={selected.id}
					checklist={selected}
					onDeleted={() => setSelectedId(null)}
				/>
			)}
		</div>
	);
}
