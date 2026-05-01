import {Activity} from 'react';
import {useAddEntry} from '../../hooks/useAddEntry';
import {Card} from '../ui/Card';
import {ModeToggle} from '../ui/ModeToggle';
import {ProductEntryForm} from './ProductEntryForm';
import {RecipeEntryForm} from './RecipeEntryForm';

const ADD_MODES = [
	{value: 'product' as const, label: 'Product'},
	{value: 'recipe' as const, label: 'Recipe'}
] as const;

export function AddEntryCard({date}: {date: string}) {
	const {
		mode,
		setMode,
		productId,
		setProductId,
		amount,
		setAmount,
		recipeId,
		setRecipeId,
		recipeAmount,
		setRecipeAmount,
		recipeWeight,
		mealTime,
		setMealTime,
		activeProduct,
		submit,
		products,
		recipes
	} = useAddEntry();

	return (
		<Card>
			<div
				style={{
					fontWeight: 600,
					fontSize: '15px',
					marginBottom: '12px',
					color: '#1b4332'
				}}>
				Add Entry
			</div>
			<ModeToggle options={ADD_MODES} value={mode} onChange={setMode} />
			<div style={{marginTop: '14px'}}>
				<Activity mode={mode === 'product' ? 'visible' : 'hidden'}>
					<ProductEntryForm
						products={products}
						productId={productId}
						onProductChange={setProductId}
						amount={amount}
						onAmountChange={setAmount}
						activeProduct={activeProduct}
						mealTime={mealTime}
						onMealChange={setMealTime}
						onSubmit={() => submit(date)}
						canSubmit={!!productId && !!amount}
					/>
				</Activity>
				<Activity mode={mode === 'recipe' ? 'visible' : 'hidden'}>
					<RecipeEntryForm
						recipes={recipes}
						recipeId={recipeId}
						onRecipeChange={setRecipeId}
						recipeAmount={recipeAmount}
						onRecipeAmountChange={setRecipeAmount}
						recipeWeight={recipeWeight}
						mealTime={mealTime}
						onMealChange={setMealTime}
						onSubmit={() => submit(date)}
						canSubmit={!!recipeId && !!recipeAmount}
					/>
				</Activity>
			</div>
		</Card>
	);
}
