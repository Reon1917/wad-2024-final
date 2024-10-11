"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function CustomerDetail() {
  const [customer, setCustomer] = useState(null);
  const router = useRouter();
  const { _id } = useParams(); // Get the _id parameter

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        console.log(`Fetching customer with _id: ${_id}`); // Log the _id
        const response = await fetch(`/api/customer?_id=${_id}`); // Use _id in the fetch URL
        if (!response.ok) {
          throw new Error('Failed to fetch customer');
        }
        const data = await response.json();
        console.log('Fetched customer data:', data); // Log the fetched data
        setCustomer(data);
      } catch (error) {
        console.error('Error fetching customer:', error);
      }
    };

    if (_id) {
      fetchCustomer();
    }
  }, [_id]);

  if (!customer) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Customer Details
      </Typography>
      <Typography variant="h6">Name: {customer.name}</Typography>
      <Typography variant="h6">Date of Birth: {new Date(customer.dateOfBirth).toLocaleDateString()}</Typography>
      <Typography variant="h6">Member Number: {customer.memberNumber}</Typography>
      <Typography variant="h6">Interests: {customer.interests}</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => router.back()}>
        Back
      </Button>
    </Box>
  );
}