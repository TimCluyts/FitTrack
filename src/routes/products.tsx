import {createFileRoute} from '@tanstack/react-router';
import {useProductForm} from '../hooks/useProductForm';
import {ProductForm} from '../components/products/ProductForm';
import {ProductListSection} from '../components/products/ProductListSection';
import {Button} from '../components/ui/Button';
import {PageHeader} from '../components/ui/PageHeader';
import {exportServerData, importServerData} from '../utils/backup';

export const Route = createFileRoute('/products')({
	component: ProductsPage
});

function ProductsPage() {
	const form = useProductForm();

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
			<PageHeader title="Products">
				<Button variant="outline" onClick={exportServerData}>
					Export Backup
				</Button>
				<Button variant="outline" onClick={importServerData}>
					Import Backup
				</Button>
				{!form.visible && (
					<Button onClick={form.open}>+ Add Product</Button>
				)}
			</PageHeader>

			{form.visible && (
				<ProductForm
					form={form.form}
					onField={form.setField}
					isEditing={form.isEditing}
					onSubmit={form.submit}
					onCancel={form.cancel}
				/>
			)}

			<ProductListSection onEdit={form.edit} />
		</div>
	);
}
