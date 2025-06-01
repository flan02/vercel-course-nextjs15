'use server';

import { db } from "@/db";
import { InvoiceFormSchema } from "@/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function createInvoice(formData: FormData) {

  const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100 // Assuming amount is in dollars, convert to cents for storage
  const date = new Date() // Format date as YYYY-MM-DD

  const newInvoice = await db.invoice.create({
    data: {
      customerId,
      amount: amountInCents,
      status,
      date
    }
  })

  console.log(newInvoice);

  revalidatePath('/app-router/dashboard/invoices'); // fresh data will be fetched from the server
  redirect('/app-router/dashboard/invoices'); // redirect to the invoices page
}



export async function updateInvoice(id: string, formData: FormData) {

  const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true })

  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  const amountInCents = Math.round(Number(amount) * 100)

  try {
    await db.invoice.update({
      where: { id },
      data: {
        customerId,
        amount: amountInCents,
        status,
      },
    })



  } catch (error) {
    console.error('Prisma Error:', error)
    throw new Error('Failed to update invoice.')
  }

  revalidatePath('/app-router/dashboard/invoices')
  redirect('/app-router/dashboard/invoices')
}


export async function deleteInvoice(id: string) {
  try {
    await db.invoice.delete({
      where: { id },
    })
  } catch (error) {
    console.error('Prisma Error:', error)
    throw new Error('Failed to delete invoice.')
  }

  revalidatePath('/app-router/dashboard/invoices')
  // Doesn't need redirect since this action is being called where the invoices are listed
  // redirect('/app-router/dashboard/invoices')
}



/* 
? Testing the createInvoice function

export async function createInvoice(formData: FormData) {
  
  Tip: If you're working with forms that have many fields, you may want to consider using 
  the entries() method with JavaScript's Object.fromEntries().
  
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  Test it out:
  console.log(rawFormData);
  console.log(typeof rawFormData.amount);
}
*/