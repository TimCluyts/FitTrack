import type {Product} from '../types/fitness';

export function toGrams(value: number, product: Product | undefined): number {
	if (!product?.servingSize) return value;
	return Math.round(value * product.servingSize * 10) / 10;
}

export function displayAmount(amount: number, product: Product): string {
	if (!product.servingSize) return `${amount}g`;
	const count = Math.round((amount / product.servingSize) * 10) / 10;
	return `${count} ${product.servingLabel ?? 'serving'} (${amount}g)`;
}
