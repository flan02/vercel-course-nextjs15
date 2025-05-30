import { db } from "@/db";
import { formatCurrency } from "@/lib/utils";

export async function fetchRevenue() {
  try {
    // *We artificially delay a response for demo purposes.
    // *Don't do this in production :)

    //console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const data = await db.revenue.findMany();
    //console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}


export async function fetchLatestInvoices() {

  try {
    const invoices = await db.invoice.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            image_url: true,
          },
        },
      },
    });

    const latestInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      amount: formatCurrency(invoice.amount),
      name: invoice.customer.name,
      email: invoice.customer.email,
      image_url: invoice.customer.image_url,
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}





export async function fetchCardData() {
  try {
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      db.invoice.count(),
      db.customer.count(),
      db.invoice.groupBy({
        by: ['status'],
        _sum: { amount: true },
      }),
    ]);

    let totalPaid = 0;
    let totalPending = 0;

    for (const group of invoiceStatus) {
      if (group.status === 'paid') {
        totalPaid = group._sum.amount ?? 0;
      } else if (group.status === 'pending') {
        totalPending = group._sum.amount ?? 0;
      }
    }

    return {
      numberOfInvoices: invoiceCount,
      numberOfCustomers: customerCount,
      totalPaidInvoices: formatCurrency(totalPaid),
      totalPendingInvoices: formatCurrency(totalPending),
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
