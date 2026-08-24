import type {ChecklistDraft} from '../../types/checklist';

const items = (...texts: string[]) => texts.map(text => ({text, done: false}));

// Offered on the empty state so a first checklist is one click away.
export const CHECKLIST_TEMPLATES: {label: string; draft: ChecklistDraft}[] = [
	{
		label: '🍕 Pizza night',
		draft: {
			name: 'Pizza night',
			emoji: '🍕',
			items: items(
				'Make the dough (24h ahead)',
				'Take dough out of the fridge (2h before)',
				'Flour',
				'Fresh yeast',
				'Passata / San Marzano tomatoes',
				'Mozzarella (fior di latte)',
				'Parmesan',
				'Basil',
				'Olive oil',
				'Toppings',
				'Preheat the oven / fire up the pizza oven',
				'Pizza peel + semolina',
				'Cutting board + pizza wheel',
				'Drinks',
				'Dessert'
			)
		}
	}
];
