import Form from '@/components/ui/invoices/create-form';
import Breadcrumbs from '@/components/ui/invoices/breadcrumbs';
import { fetchCustomers } from '../../actions';


export default async function InvoicesCreatePage() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/app-router/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/app-router/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}