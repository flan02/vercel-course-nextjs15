// src/app/api/test/route.ts
import { Invoice, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// ! This API allows me to send a lot of data via postman

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.user.findMany(); // cambia "tuModelo" por el nombre de tu modelo en schema.prisma
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}





export async function POST(req: Request) {
  try {
    const revenues = await req.json()

    if (!Array.isArray(revenues)) {
      return NextResponse.json({ error: 'El cuerpo debe ser un array de objetos' }, { status: 400 })
    }

    await prisma.revenue.createMany({
      data: revenues
    })

    return NextResponse.json({ message: 'Clientes creados exitosamente' }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al insertar clientes' }, { status: 500 })
  }
}


// export async function POST(req: Request) {
//   try {
//     const body: Invoice = await req.json()

//     // if (!Array.isArray(body)) {
//     //   return NextResponse.json({ error: 'El cuerpo debe ser un array de objetos' }, { status: 400 })
//     // }

//     // await prisma.invoice.createMany({
//     //   data: invoices
//     // })

//     const invoice = await prisma.invoice.create({
//       data: {
//         customerId: body.customerId,
//         amount: body.amount,
//         status: body.status,
//         date: new Date(body.date),
//       },
//     })

//     return NextResponse.json({ message: 'Invoice creado exitosamente' }, { status: 201 })
//   } catch (error) {
//     //console.error(error)
//     return NextResponse.json({ error: 'Error al insertar clientes' }, { status: 500 })
//   }
// }