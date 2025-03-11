import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CiSquarePlus } from "react-icons/ci";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import stance from "../interceptors/interceptors";
import "./Admindashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [salesmen, setSalesmen] = useState([]);
    const [activeTab, setActiveTab] = useState("customers");

    // customer
    const [Customermodal, setCustomermodal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [customform, setCustomform] = useState({
        name: "",
        email: "",
        phonenumber: "",
        place: ""
    });

    //product
    const [productModal, setProductmodal] = useState(false);
    const [preditmodal, setPreditmodal] = useState(false);
    const [selectedproduct, setSelectedproduct] = useState(null);

    const [productform, setProductform] = useState({
        name: "",
        price: "",
        discountPercentage: ""
    });

    // salesman
    const [salesmanModal, setSalesmanModal] = useState(false);
    const [salesmanEditModal, setSalesmanEditModal] = useState(false);
    const [selectedSalesman, setSelectedSalesman] = useState(null);

    const [salesmanForm, setSalesmanForm] = useState({
        name: "",
        email: "",
        phonenumber: "",
        age: "",
        place: "",
        password:""
    });

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/login");
        }
    }, [navigate]);

    const fetchData = async () => {
        try {
            const [customersRes, productsRes, salesmenRes] = await Promise.all([
                stance.get("/api/admin/customers"),
                stance.get("/api/admin/products"),
                stance.get("/api/admin/salesmen"),
            ]);
    
            setCustomers(customersRes.data);
            setProducts(productsRes.data);
            setSalesmen(salesmenRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

    useEffect(() => {
        fetchData();
    }, []);

    const handlecustomchnge = (e) => {
        setCustomform({ ...customform, [e.target.name]: e.target.value });
    };

    const handlecustomsbmt = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await stance.post("/api/admin/customers",
                {
                    name: customform.name,
                    email: customform.email,
                    phonenumber: parseInt(customform.phonenumber, 10),
                    place: customform.place,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchData();
            setCustomermodal(false);
            setCustomform({ name: "", email: "", phonenumber: "", place: "" });
        } catch (error) {
            console.error("Error adding customer", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await stance.delete(`/api/admin/customers/${id}`);
            fetchData(); // Refresh data after deletion
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };
    

    const handleEditClick = (customer) => {
        setSelectedCustomer(customer);
        setEditModal(true);
    };

    const handleEditChange = (e) => {
        setSelectedCustomer({ ...selectedCustomer, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await stance.put(`/api/admin/customers/${selectedCustomer._id}`, selectedCustomer);
            fetchData(); // Refresh data after update
            setEditModal(false);
            setSelectedCustomer(null);
        } catch (error) {
            console.error("Error updating customer:", error);
        }
    };

    const handleProductChange = (e) => {
        setProductform({ ...productform, [e.target.name]: e.target.value });
    };
    
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
    
        try {
            await stance.post("/api/admin/products", {
                name: productform.name,
                price: parseFloat(productform.price),
                discountPercentage: parseFloat(productform.discountPercentage),
            });
        
            fetchData(); // Refresh the data after adding a product
            setProductmodal(false);
            setProductform({ name: "", price: "", discountPercentage: "" });
        } catch (error) {
            console.error("Error adding product", error);
        }
    };
    
    const handleProductDelete = async (id) => {
        try {
            await stance.delete(`/api/admin/products/${id}`);
            fetchData(); // Refresh data after deletion
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };
    
    
    const handleProductEditClick = (product) => {
        setSelectedproduct(product);
        setPreditmodal(true);
    };
    
    const handleProductEditChange = (e) => {
        setSelectedproduct({ ...selectedproduct, [e.target.name]: e.target.value });
    };
    
    const handleProductEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
    
        try {
            await stance.put(`/api/admin/products/${selectedproduct._id}`, selectedproduct);
            fetchData(); // Refresh data after update
            setPreditmodal(false);
            setSelectedproduct(null);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    // Salesman functions
    const handleSalesmanChange = (e) => {
        setSalesmanForm({ ...salesmanForm, [e.target.name]: e.target.value });
    };

    const handleSalesmanSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await stance.post("/api/admin/salesmen", {
                name: salesmanForm.name,
                email: salesmanForm.email,
                phonenumber: parseInt(salesmanForm.phonenumber, 10),
                age: parseInt(salesmanForm.age, 10),
                place: salesmanForm.place,
                password: salesmanForm.password
            });
        
            console.log("Salesman Form Data:", salesmanForm);
            
            fetchData(); // Refresh data after adding
            setSalesmanModal(false);
            setSalesmanForm({ name: "", email: "", phonenumber: "", age: "", place: "", password: "" });
        } catch (error) {
            console.error("Error adding salesman", error);
        }
    };

    const handleSalesmanDelete = async (id) => {
        try {
            await stance.delete(`/api/admin/salesmen/${id}`);
            fetchData(); // Refresh data after deletion
        } catch (error) {
            console.error("Error deleting salesman:", error);
        }
    };
        

    const handleSalesmanEditClick = (salesman) => {
        setSelectedSalesman(salesman);
        setSalesmanEditModal(true);
    };

    const handleSalesmanEditChange = (e) => {
        setSelectedSalesman({ ...selectedSalesman, [e.target.name]: e.target.value });
    };

    const handleSalesmanEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await stance.put(`/api/admin/salesmen/${selectedSalesman._id}`, selectedSalesman);
            fetchData();
            setSalesmanEditModal(false);
            setSelectedSalesman(null);
        } catch (error) {
            console.error("Error updating salesman", error);
        }
    };

    return (
        <div className="dashboard-wrapper">
            <div className="sidebar">
                <h2>Admin Dashboard</h2>
                <button onClick={() => setActiveTab("customers")} className={activeTab === "customers" ? "active" : ""}>Customers</button>
                <button onClick={() => setActiveTab("products")} className={activeTab === "products" ? "active" : ""}>Products</button>
                <button onClick={() => setActiveTab("salesmen")} className={activeTab === "salesmen" ? "active" : ""}>Salesmen</button>
                <div className="logout">
                <button onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</button>

                </div>
            </div>

            <div className="content">
                {activeTab === "customers" && (
                    <div>
                        <h1>Customer Details <CiSquarePlus onClick={() => setCustomermodal(true)} style={{ cursor: "pointer", fontSize: "24px" }} /></h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Place</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer._id}>
                                        <td>{customer.name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phonenumber}</td>
                                        <td>{customer.place}</td>
                                        <td>
                                            <BiEdit style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => handleEditClick(customer)} />
                                            <AiFillDelete style={{ cursor: "pointer", color: "red" }} onClick={() => handleDelete(customer._id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                 {activeTab === "products" && (
        <div>
            <h1>Product Details <CiSquarePlus style={{cursor:"pointer",fontSize:"24px"}} onClick={() => setProductmodal(true)}/></h1>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>discount in %</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.discountPercentage}</td>
                            <td><BiEdit style={{cursor:"pointer",marginRight:"10px"}} onClick={() => handleProductEditClick(product)}/> 
                            <AiFillDelete style={{cursor:"pointer", color:"red"}} onClick={() => handleProductDelete(product._id)}/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )}

{activeTab === "salesmen" && (
    <div>
        <h1>Salesmen Details 
            <CiSquarePlus style={{cursor:"pointer",fontSize:"24px"}} 
                onClick={() => setSalesmanModal(true)} 
            />
        </h1>
        {salesmen && salesmen.length > 0 ? (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Place</th>
                        <th>Phone Number</th>
                        <th>Age</th>
                        <th>Actions</th>
                        <th>details</th>
                    </tr>
                </thead>
                <tbody>
            {salesmen.map((salesman) => (
                <tr key={salesman._id}>
                    <td>{salesman.name}</td>
                    <td>{salesman.email}</td>
                    <td>{salesman.place}</td>
                    <td>{salesman.phonenumber}</td>
                    <td>{salesman.age}</td>
                    <td>
                        <BiEdit 
                            style={{ cursor: "pointer", marginRight: "10px" }} 
                            onClick={() => handleSalesmanEditClick(salesman)} 
                        /> 
                        <AiFillDelete 
                            style={{ cursor: "pointer", color: "red" }} 
                            onClick={() => handleSalesmanDelete(salesman._id)} 
                        />
                    </td>
                    {/* Add navigation to the SalesDetails page */}
                    <td>
                        <button 
                            onClick={() => navigate(`/salesdetails/${salesman._id}`)}
                            style={{ cursor: "pointer", padding: "5px 10px", background: "blue", color: "white", borderRadius: "5px" }}
                        >
                            Sales
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
            </table>
        ) : (
            <p>No salesmen found.</p>
        )}
    </div>
)}

            </div>

            {/* Add Customer Modal */}
            {Customermodal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Customer</h2>
                        <input type="text" name="name" placeholder="Customer Name" value={customform.name} onChange={handlecustomchnge} />
                        <input type="email" name="email" placeholder="Email" value={customform.email} onChange={handlecustomchnge} />
                        <input type="text" name="phonenumber" placeholder="Phone Number" value={customform.phonenumber} onChange={handlecustomchnge} />
                        <input type="text" name="place" placeholder="Place" value={customform.place} onChange={handlecustomchnge} />
                        <button onClick={(e) => handlecustomsbmt(e)}>Add Customer</button>
                        <button onClick={() => setCustomermodal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Edit Customer Modal */}
            {editModal && selectedCustomer && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Customer</h2>
                        <input type="text" name="name" value={selectedCustomer.name} onChange={handleEditChange} />
                        <input type="email" name="email" value={selectedCustomer.email} onChange={handleEditChange} />
                        <input type="text" name="phonenumber" value={selectedCustomer.phonenumber} onChange={handleEditChange} />
                        <input type="text" name="place" value={selectedCustomer.place} onChange={handleEditChange} />
                        <button onClick={(e) => handleEditSubmit(e)}>Update Customer</button>
                        <button onClick={() => setEditModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {productModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Product</h2>
                        <input type="text" name="name" placeholder="Product Name" value={productform.name} onChange={handleProductChange} />
                        <input type="number" name="price" placeholder="Price" value={productform.price} onChange={handleProductChange} />
                        <input type="number" name="discountPercentage" placeholder="Discount Percentage" value={productform.discountPercentage} onChange={handleProductChange} />
                        <button onClick={(e) => handleProductSubmit(e)}>Add Product</button>
                        <button onClick={() => setProductmodal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {preditmodal && selectedproduct && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Product</h2>
                        <input type="text" name="name" value={selectedproduct.name} onChange={handleProductEditChange} />
                        <input type="number" name="price" value={selectedproduct.price} onChange={handleProductEditChange} />
                        <input type="number" name="discountPercentage" value={selectedproduct.discountPercentage} onChange={handleProductEditChange} />
                        <button onClick={(e) => handleProductEditSubmit(e)}>Update Product</button>
                        <button onClick={() => setPreditmodal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Add Salesman Modal */}
            {salesmanModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Salesman</h2>
                        <input type="text" name="name" placeholder="Salesman Name" value={salesmanForm.name} onChange={handleSalesmanChange} />
                        <input type="email" name="email" placeholder="Email" value={salesmanForm.email} onChange={handleSalesmanChange} />
                        <input type="text" name="phonenumber" placeholder="Phone Number" value={salesmanForm.phonenumber} onChange={handleSalesmanChange} />
                        <input type="number" name="age" placeholder="Age" value={salesmanForm.age} onChange={handleSalesmanChange} />
                        <input type="text" name="place" placeholder="Place" value={salesmanForm.place} onChange={handleSalesmanChange} />
                        <input type="password" name="password" placeholder="password" value={salesmanForm.password} onChange={handleSalesmanChange}/>
                        <button onClick={(e) => handleSalesmanSubmit(e)}>Add Salesman</button>
                        <button onClick={() => setSalesmanModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Edit Salesman Modal */}
            {salesmanEditModal && selectedSalesman && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Salesman</h2>
                        <input type="text" name="name" value={selectedSalesman.name} onChange={handleSalesmanEditChange} />
                        <input type="email" name="email" value={selectedSalesman.email} onChange={handleSalesmanEditChange} />
                        <input type="text" name="phonenumber" value={selectedSalesman.phonenumber} onChange={handleSalesmanEditChange} />
                        <input type="number" name="age" value={selectedSalesman.age} onChange={handleSalesmanEditChange} />
                        <input type="text" name="place" value={selectedSalesman.place} onChange={handleSalesmanEditChange} />
                        <button onClick={(e) => handleSalesmanEditSubmit(e)}>Update Salesman</button>
                        <button onClick={() => setSalesmanEditModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

        </div>
    );
};
    
export default AdminDashboard;