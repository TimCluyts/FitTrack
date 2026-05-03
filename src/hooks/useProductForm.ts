import {useState} from 'react';
import {useAddProduct, useUpdateProduct} from './useApi';
import type {Product} from '../types/fitness';

export type ProductFormData = {
	name: string;
	kcal: string;
	protein: string;
	fat: string;
	carbs: string;
	servingSize: string;
	servingLabel: string;
};

const empty: ProductFormData = {
	name: '',
	kcal: '',
	protein: '',
	fat: '',
	carbs: '',
	servingSize: '',
	servingLabel: ''
};

export function useProductForm() {
	const addProduct = useAddProduct();
	const updateProduct = useUpdateProduct();
	const [editId, setEditId] = useState<string | null>(null);
	const [form, setForm] = useState<ProductFormData>(empty);
	const [visible, setVisible] = useState(false);

	const setField = (field: keyof ProductFormData, value: string) =>
		setForm(prev => ({...prev, [field]: value}));

	const open = () => {
		setEditId(null);
		setForm(empty);
		setVisible(true);
	};

	const edit = (product: Product) => {
		setEditId(product.id);
		setForm({
			name: product.name,
			kcal: String(product.kcal),
			protein: String(product.protein),
			fat: String(product.fat),
			carbs: String(product.carbs),
			servingSize: product.servingSize ? String(product.servingSize) : '',
			servingLabel: product.servingLabel ?? ''
		});
		setVisible(true);
	};

	const cancel = () => {
		setEditId(null);
		setForm(empty);
		setVisible(false);
	};

	const submit = (): boolean => {
		if (!form.name.trim() || !form.kcal) return false;
		const servingSize = parseFloat(form.servingSize);
		const data = {
			name: form.name.trim(),
			kcal: parseFloat(form.kcal) || 0,
			protein: parseFloat(form.protein) || 0,
			fat: parseFloat(form.fat) || 0,
			carbs: parseFloat(form.carbs) || 0,
			...(servingSize > 0
				? {
						servingSize,
						servingLabel: form.servingLabel.trim() || undefined
					}
				: {})
		};
		if (editId) {
			updateProduct.mutate({id: editId, data});
		} else {
			addProduct.mutate(data);
		}
		setEditId(null);
		setForm(empty);
		setVisible(false);
		return true;
	};

	return {
		form,
		setField,
		visible,
		isEditing: editId !== null,
		open,
		edit,
		cancel,
		submit
	};
}
