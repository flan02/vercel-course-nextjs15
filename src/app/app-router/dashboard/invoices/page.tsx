import Pagination from '@/components/ui/invoices/pagination';
import Search from '@/components/ui/search';
import Table from '@/components/ui/invoices/table';
import { CreateInvoice } from '@/components/ui/invoices/buttons';

import { InvoicesTableSkeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '../actions';



type SearchParamsProps = {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function InvoicesPage(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  const query = searchParams?.query || '';
  const totalPages = await fetchInvoicesPages(query);


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`font-lusitana text-2xl font-bold`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* CLIENT SIDE COMPONENT */}
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>

      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        {/* SERVER SIDE COMPONENT */}
        <Table query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        {/* CLIENT SIDE COMPONENT */}
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}