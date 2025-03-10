import { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SalesForm = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const initialFormState = {
    customer: "",
    email: "",
    place: "",
    product: "",
    price: "",
    discountPercentage: "",
    quantity: 1,
    totalAmount: 0,
    salesman: localStorage.getItem("name") || "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchCustomers = async (query) => {
    if (query.length > 0) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/sales/search/customers?name=${query}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error.response?.data || error.message);
      }
    }
  };

  const fetchProducts = async (query) => {
    if (query.length > 0) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/sales/search/products?name=${query}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
      }
    }
  };

  const handleCustomerSelect = (event, value) => {
    if (value) {
      setFormData({ ...formData, customer: value._id, email: value.email, place: value.place });
    }
  };

  const handleProductSelect = (event, value) => {
    if (value) {
      const discount = (value.price * value.discountPercentage) / 100;
      const discountedPrice = value.price - discount;
      setFormData({
        ...formData,
        product: value._id,  // Store only the product's _id
        price: value.price,
        discountPercentage: value.discountPercentage,
        totalAmount: formData.quantity * discountedPrice,
      });
      
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === "quantity" ? Number(e.target.value) : e.target.value,
    });
  };
  

  useEffect(() => {
    setFormData((prev) => ({ ...prev, salesman: localStorage.getItem("name") || "" }));
  }, []);

  useEffect(() => {
    if (formData.price && formData.quantity) {
      const discount = (formData.price * formData.discountPercentage) / 100;
      const discountedPrice = formData.price - discount;
      setFormData((prev) => ({ ...prev, totalAmount: prev.quantity * discountedPrice }));
    }
  }, [formData.quantity, formData.price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User might not be authenticated.");
      return;
    }
  
    try {
      // Log formData before processing
      console.log("Form Data Before Submission:", formData);
  
      // Ensure that only IDs are sent
      const requestData = {
        customer: typeof formData.customer === "object" ? formData.customer._id : formData.customer,
        product: typeof formData.product === "object" ? formData.product._id : formData.product,
        salesman: typeof formData.salesman === "object" ? formData.salesman._id : formData.salesman, // Ensure it's an ID
        quantity: Number(formData.quantity), // Ensure it's a number
        totalAmount: formData.totalAmount ? Number(formData.totalAmount) : 0, // Ensure it's a number
      };
      
  
      console.log("Request Data:", requestData); // Debugging log before sending
  
      // Send POST request
      const response = await axios.post("http://localhost:5000/api/sales/salesform", requestData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
  
      console.log("Success:", response.data); // Log success response
  
      setFormData(initialFormState); // Reset form after success
    } catch (error) {
      console.error("Error submitting sales form:", error.response?.data || error.message);
    }
  };
  
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" gutterBottom>
        Sales Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete options={customers} getOptionLabel={(option) => option.name} onInputChange={(e, value) => fetchCustomers(value)} onChange={handleCustomerSelect} renderInput={(params) => <TextField {...params} label="Customer Name" required />} />
          </Grid>
          <Grid item xs={12} sm={6}><TextField label="Email" fullWidth value={formData.email} disabled /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Place" fullWidth value={formData.place} disabled /></Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete options={products} getOptionLabel={(option) => option.name} onInputChange={(e, value) => fetchProducts(value)} onChange={handleProductSelect} renderInput={(params) => <TextField {...params} label="Product Name" required />} />
          </Grid>
          <Grid item xs={12} sm={6}><TextField label="Price" fullWidth value={formData.price} disabled /></Grid>
          <Grid item xs={12} sm={6}>
  <TextField
    label="Discounted Price"
    fullWidth
    value={formData.price - (formData.price * formData.discountPercentage) / 100}
    disabled
  />
</Grid>
          <Grid item xs={12} sm={6}><TextField label="Quantity" name="quantity" type="number" fullWidth value={formData.quantity} onChange={handleChange} required /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Total Amount" fullWidth value={formData.totalAmount} disabled /></Grid>
          <Grid item xs={12}><TextField label="Salesman Name" fullWidth value={formData.salesman} disabled /></Grid>
          <Grid item xs={6}><Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button></Grid>
          <Grid item xs={6}><Button variant="contained" color="secondary" fullWidth onClick={handleLogout}>Logout</Button></Grid>
          <Grid item xs={12}><Button variant="contained" color="success" fullWidth onClick={() => navigate("/checkout")}>Checkout</Button></Grid>
          </Grid>
      </form>
    </Container>
  );
};

export default SalesForm;
