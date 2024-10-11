import { NextResponse } from 'next/server';
import Customer from '@/models/Customer';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose'; // Ensure mongoose is imported

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('_id');

  if (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: '_id must be a valid MongoDB ObjectId' }, { status: 400 });
    }
    try {
      const customer = await Customer.findById(id);
      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }
      return NextResponse.json(customer);
    } catch (error) {
      console.error(`Error fetching customer with _id ${id}:`, error); // Log the error
      return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
    }
  } else {
    try {
      const customers = await Customer.find();
      return NextResponse.json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error); // Log the error
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
  }
}

