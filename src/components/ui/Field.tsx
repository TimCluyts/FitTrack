import type {
	CSSProperties,
	InputHTMLAttributes,
	ReactNode,
	SelectHTMLAttributes
} from 'react';

const labelStyle: CSSProperties = {
	display: 'block',
	fontSize: '12px',
	fontWeight: 500,
	color: '#4a5568',
	marginBottom: '4px'
};

const inputBase: CSSProperties = {
	width: '100%',
	padding: '8px 10px',
	border: '1px solid #d1d9d1',
	borderRadius: '6px',
	fontSize: '14px',
	outline: 'none',
	boxSizing: 'border-box',
	fontFamily: 'inherit'
};

function FieldLabel({children}: {children: ReactNode}) {
	return <label style={labelStyle}>{children}</label>;
}

function FieldInput({style, ...props}: InputHTMLAttributes<HTMLInputElement>) {
	return <input style={{...inputBase, ...style}} {...props} />;
}

function FieldSelect({
	style,
	children,
	...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<select
			style={{
				...inputBase,
				cursor: 'pointer',
				backgroundColor: 'white',
				...style
			}}
			{...props}>
			{children}
		</select>
	);
}

function FieldHint({children}: {children: ReactNode}) {
	return (
		<div style={{fontSize: '11px', color: '#a0aec0', marginTop: '3px'}}>
			{children}
		</div>
	);
}

function FieldRoot({
	children,
	style
}: {
	children: ReactNode;
	style?: CSSProperties;
}) {
	return <div style={style}>{children}</div>;
}

export const Field = Object.assign(FieldRoot, {
	Label: FieldLabel,
	Input: FieldInput,
	Select: FieldSelect,
	Hint: FieldHint
});
