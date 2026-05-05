import {useEffect, useMemo, useState} from 'react';
import {useAddRunLog, useWeightEntries} from './useApi';
import {formatPace} from '../utils/pace';

export function useRunLogForm(onSave: () => void) {
	const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
	const [distanceKm, setDistanceKm] = useState('');
	const [durationMin, setDurationMin] = useState('');
	const [speedKmh, setSpeedKmh] = useState('');
	const [kcal, setKcal] = useState('');
	const [note, setNote] = useState('');

	const addRunLog = useAddRunLog();
	const {data: weightEntries = []} = useWeightEntries();

	const latestWeight = useMemo(() => {
		if (!weightEntries.length) return null;
		return weightEntries.reduce((latest, e) =>
			e.date > latest.date ? e : latest
		).weight;
	}, [weightEntries]);

	useEffect(() => {
		const d = parseFloat(distanceKm);
		const t = parseFloat(durationMin);
		if (d > 0 && t > 0) setSpeedKmh(((d / t) * 60).toFixed(2));
	}, [distanceKm, durationMin]);

	useEffect(() => {
		const d = parseFloat(distanceKm);
		if (d > 0 && latestWeight != null)
			setKcal(Math.round(latestWeight * d).toString());
	}, [distanceKm, latestWeight]);

	const canSave = distanceKm !== '' && parseFloat(distanceKm) > 0;

	const pace = useMemo(() => {
		const d = parseFloat(distanceKm);
		const t = parseFloat(durationMin);
		return d > 0 && t > 0 ? formatPace(t / d) : null;
	}, [distanceKm, durationMin]);

	const handleSave = () => {
		if (!canSave) return;
		addRunLog.mutate({
			date,
			distanceKm: parseFloat(distanceKm),
			...(durationMin ? {durationMin: parseFloat(durationMin)} : {}),
			...(speedKmh ? {speedKmh: parseFloat(speedKmh)} : {}),
			...(kcal ? {kcal: parseFloat(kcal)} : {}),
			...(note.trim() ? {note: note.trim()} : {})
		});
		onSave();
	};

	return {
		date, setDate,
		distanceKm, setDistanceKm,
		durationMin, setDurationMin,
		speedKmh, setSpeedKmh,
		kcal, setKcal,
		note, setNote,
		latestWeight,
		canSave,
		pace,
		handleSave
	};
}
