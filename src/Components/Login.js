import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import
import { useNavigate } from "react-router-dom";
import "./Login.css";
import stance from "../interceptors/interceptors";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin"); // Default role is Admin
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [userName, setUserName] = useState(""); // Store name

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const endpoint = role === "admin"
            ? "/api/admin/login"
            : "/api/sales/login";

        try {
            const response = await stance.post(endpoint, { email, password }, {
                headers: { "Content-Type": "application/json" }
            });

            setMessage("Login Successful!");
            const token = response.data.token;
            localStorage.setItem("token", token); // Store token for authentication

            // Decode JWT token
            const decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded); // Debugging

            setUserName(decoded.name); // Set user name in state
            localStorage.setItem("salesmanId", decoded.salesmanId); // ✅ Fix: Use `salesmanId`
            localStorage.setItem("name", decoded.name); // Store Name
            localStorage.setItem("role", decoded.role);

            if (decoded.role === "admin") {
                navigate("/adminboard"); // Redirect to Admin Dashboard
            } else if (decoded.role === "salesman") {
                navigate("/salesboard"); // Redirect to Salesman Dashboard
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>

                {error && <p className="error">{error}</p>}
                {message && <p className="success">{message}</p>}

                {userName && <h3>Welcome, {userName}!</h3>} {/* Display name after login */}

                <div className="input-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="salesman">Salesman</option>
                    </select>
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
