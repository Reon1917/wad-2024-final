import { NextResponse } from "next/server";
import Customer from "@/models/Customer";
import dbConnect from "@/lib/db";

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const memberNumber = searchParams.get('memberNumber');
  
    console.log(`Fetching customer with memberNumber: ${memberNumber}`); // Log the memberNumber
  
    if (memberNumber) {
      if (isNaN(memberNumber)) {
        return NextResponse.json({ error: 'memberNumber must be a number' }, { status: 400 });
      }
      try {
        const customer = await Customer.findOne({ memberNumber });
        if (!customer) {
          return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json(customer);
      } catch (error) {
        console.error(`Error fetching customer with memberNumber ${memberNumber}:`, error); // Log the error
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

export async function POST(request) {
  await dbConnect();
  try {
    const data = await request.json();

    // Validate required fields
    const { name, dateOfBirth, memberNumber, interests } = data;
    if (
      !name ||
      !dateOfBirth ||
      !memberNumber ||
      !interests ||
      isNaN(memberNumber)
    ) {
      return NextResponse.json(
        {
          error:
            "All fields are required, and member number should be a number",
        },
        { status: 400 }
      );
    }

    const newCustomer = new Customer({
      name,
      dateOfBirth,
      memberNumber,
      interests,
    });
    await newCustomer.save();
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Error adding customer:", error);
    return NextResponse.json(
      { error: "Failed to add customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await dbConnect();
  try {
    const { memberNumber } = await request.json();
    if (!memberNumber || isNaN(memberNumber)) {
      return NextResponse.json(
        { error: "Member number is required and should be a number" },
        { status: 400 }
      );
    }

    const deletedCustomer = await Customer.findOneAndDelete({ memberNumber });
    if (!deletedCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
    await dbConnect();
    try {
      const data = await request.json();
  
      // Validate required fields
      const { name, dateOfBirth, memberNumber, interests } = data;
      if (
        !name ||
        !dateOfBirth ||
        !memberNumber ||
        !interests ||
        isNaN(memberNumber)
      ) {
        return NextResponse.json(
          {
            error:
              "All fields are required, and member number should be a number",
          },
          { status: 400 }
        );
      }
  
      const updatedCustomer = await Customer.findOneAndUpdate(
        { memberNumber },
        { name, dateOfBirth, interests },
        { new: true }
      );
  
      if (!updatedCustomer) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(updatedCustomer, { status: 200 });
    } catch (error) {
      console.error("Error updating customer:", error);
      return NextResponse.json(
        { error: "Failed to update customer" },
        { status: 500 }
      );
    }
  }