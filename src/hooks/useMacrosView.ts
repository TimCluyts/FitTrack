import {useState} from 'react';
import type {MacroKey} from '../components/report/macroConfig';

export type MacroViewMode = 'stacked' | 'lines';

export function useMacrosView() {
	const [view, setView] = useState<MacroViewMode>('stacked');
	const [active, setActive] = useState<Record<MacroKey, boolean>>({
		protein: true,
		fat: true,
		carbs: true
	});

	const toggleMacro = (key: MacroKey) =>
		setActive(a => ({...a, [key]: !a[key]}));

	return {view, setView, active, toggleMacro};
}
