// Checklists are deliberately a different "kind" of app inside FitTrack, so
// they get their own warm accent instead of the green fitness palette.
export const accent = {
	deep: '#9a3412',
	main: '#c2410c',
	soft: '#fff7ed',
	softer: '#fffbf5',
	border: '#fed7aa',
	muted: '#a8a29e'
};

export const inputStyle: React.CSSProperties = {
	width: '100%',
	padding: '8px 10px',
	border: `1px solid ${accent.border}`,
	borderRadius: '6px',
	fontSize: '14px',
	outline: 'none',
	boxSizing: 'border-box',
	fontFamily: 'inherit',
	background: 'white'
};
