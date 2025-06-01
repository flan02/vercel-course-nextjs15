import Breadcrumbs from "@/components/ui/invoices/breadcrumbs";
import Form from '@/components/ui/invoices/edit-form';
import { fetchCustomers, fetchInvoiceById } from "../../../actions";


type ParamsType = {
  params: Promise<{ id: string }>;
}

export default async function InvoicesUpdatePage(props: ParamsType) {
  const id = (await props.params).id;
  const customers = await fetchCustomers()

  const invoice = await fetchInvoiceById(id)
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/app-router/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/app-router/dashboard/invoices/${id}/edit`,
            active: true,
          }
        ]}
      />
      <Form invoice={invoice!} customers={customers} />
    </main>
  );
}