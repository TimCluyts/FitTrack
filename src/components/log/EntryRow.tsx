import {ENTRY_ROW_REGISTRY, type EntryRowProps} from './entryRowRegistry';

export function EntryRow(props: Readonly<EntryRowProps>) {
	const Row = ENTRY_ROW_REGISTRY.find(({matches}) => matches(props.entry))!.component;
	return <Row {...props} />;
}
