import { db } from "@/db";
import { CustomerField, InvoiceForm, InvoicesTable } from "@/lib/definitions";
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


const ITEMS_PER_PAGE = 6;


export async function fetchFilteredInvoices(query: string, currentPage: number): Promise<InvoicesTable[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  try {
    const invoices = await db.invoice.findMany({
      skip: offset,
      take: ITEMS_PER_PAGE,
      orderBy: {
        date: "desc",
      },
      where: {
        OR: [
          {
            customer: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            customer: {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            amount: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          },
          {
            date: {
              equals: isNaN(Date.parse(query)) ? undefined : new Date(query),
            },
          },
          {
            status: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            image_url: true,
          },
        },
      },
    })

    // ✅ Map to match InvoicesTable
    const formatted: InvoicesTable[] = invoices.map((inv) => ({
      id: inv.id,
      customer_id: inv.customerId,
      name: inv.customer?.name || "",
      email: inv.customer?.email || "",
      image_url: inv.customer?.image_url || "",
      date: inv.date.toISOString(), // o .toLocaleDateString() si preferís
      amount: inv.amount,
      status: inv.status as "pending" | "paid",
    }))

    return formatted
  } catch (error) {
    console.error("MongoDB Error:", error)
    throw new Error("Failed to fetch invoices.")
  }
}



export async function fetchInvoicesPages(query: string): Promise<number> {
  try {
    const count = await db.invoice.count({
      where: {
        OR: [
          {
            customer: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            customer: {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            amount: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          },
          {
            status: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    })

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error("Prisma Error:", error)
    throw new Error("Failed to fetch total number of invoices.")
  }
}


export async function fetchCustomers(): Promise<CustomerField[]> {
  try {
    const customers = await db.customer.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return customers
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to fetch all customers.")
  }
}


export async function fetchInvoiceById(id: string): Promise<InvoiceForm | null> {

  if (id == null) {
    return null
  }
  try {
    const invoice = await db.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        customerId: true,
        amount: true,
        status: true,
      },
    });


    if (!invoice) return null

    const formattedInvoice: InvoiceForm = {
      ...invoice,
      amount: invoice.amount / 100, // convertir de centavos a dólares
      status: invoice.status as "pending" | "paid",
    };

    return formattedInvoice;
  } catch (error) {
    console.error("Prisma Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}