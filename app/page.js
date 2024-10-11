"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function HomeV2() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    memberNumber: "",
    interests: "",
  });
  const [modalForm, setModalForm] = useState({
    name: "",
    dateOfBirth: "",
    memberNumber: "",
    interests: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await fetch("/api/customer");
      const data = await response.json();
      setCustomers(data);
    };
    fetchCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalForm({ ...modalForm, [name]: value });
  };

  const handleAddCustomer = async () => {
    // Client-side validation
    const { name, dateOfBirth, memberNumber, interests } = form;
    if (!name || !dateOfBirth || !memberNumber || !interests) {
      console.error("All fields are required");
      return;
    }

    const formData = {
      ...form,
    };

    try {
      const response = await fetch("/api/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add customer:", errorData.message || "Unknown error");
        return;
      }

      const newCustomer = await response.json();
      setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
      setForm({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
    } catch (error) {
      console.error("An error occurred while adding the customer:", error);
    }
  };

  const handleEditCustomer = async () => {
    // Client-side validation
    const { name, dateOfBirth, memberNumber, interests } = modalForm;
    if (!name || !dateOfBirth || !memberNumber || !interests) {
      console.error("All fields are required");
      return;
    }

    const formData = {
      ...modalForm,
    };

    try {
      const response = await fetch("/api/customer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update customer:", errorData.message || "Unknown error");
        return;
      }

      const updatedCustomer = await response.json();
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.memberNumber === updatedCustomer.memberNumber
            ? updatedCustomer
            : customer
        )
      );
      setModalForm({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
      setOpen(false);
    } catch (error) {
      console.error("An error occurred while updating the customer:", error);
    }
  };

  const handleDeleteCustomer = async (memberNumber) => {
    try {
      const response = await fetch("/api/customer", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to delete customer:", errorData.message || "Unknown error");
        return;
      }

      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.memberNumber !== memberNumber)
      );
    } catch (error) {
      console.error("An error occurred while deleting the customer:", error);
    }
  };

  const handleOpenModal = (customer) => {
    setModalForm(customer);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setModalForm({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
    setIsEditMode(false);
    setOpen(false);
  };

  const handleCardClick = (_id) => {
    router.push(`/customer?_id=${_id}`);
  };

  return (
    <main>
      <div className="w-full h-full my-10 mx-10">
        <h1 className="font-bold text-xl">Stock App</h1>
        <p>Simple stock management</p>
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Member Number"
            name="memberNumber"
            value={form.memberNumber}
            onChange={handleInputChange}
          />
          <TextField
            label="Interests"
            name="interests"
            value={form.interests}
            onChange={handleInputChange}
          />
          <Button variant="contained" onClick={handleAddCustomer}>
            Add Customer
          </Button>
        </Box>
        {customers.map((customer) => (
          <Card key={customer.memberNumber} sx={{ maxWidth: 400, marginTop: 2 }} onClick={() => handleCardClick(customer.memberNumber)}>
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                Customer Info
              </Typography>
              <Typography variant="h5" component="div">
                {customer.name}
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Date of Birth:{" "}
                {new Date(customer.dateOfBirth).toLocaleDateString()}
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Member Number: {customer.memberNumber}
              </Typography>
              <Typography variant="body2">
                Interests: {customer.interests}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={(e) => { e.stopPropagation(); handleOpenModal(customer); }}>
                Edit
              </Button>
              <Button size="small" onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(customer.memberNumber); }}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>

      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {isEditMode ? "Edit Customer" : "Add Customer"}
          </Typography>
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Name"
              name="name"
              value={modalForm.name}
              onChange={handleModalInputChange}
            />
            <TextField
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={modalForm.dateOfBirth}
              onChange={handleModalInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Member Number"
              name="memberNumber"
              value={modalForm.memberNumber}
              onChange={handleModalInputChange}
            />
            <TextField
              label="Interests"
              name="interests"
              value={modalForm.interests}
              onChange={handleModalInputChange}
            />
          </Box>
          <Button
            variant="contained"
            sx={{ marginTop: 2 }}
            onClick={handleEditCustomer}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </main>
  );
}