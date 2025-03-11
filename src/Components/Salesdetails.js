import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import stance from "../interceptors/interceptors";

const SalesDetails = () => {
  const [sales, setSales] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { salesmanId } = useParams(); // Get salesmanId from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        console.log("Fetching sales for Salesman ID:", salesmanId);

        const response = await stance.get(
          `/api/admin/salesmen/${salesmanId}/sales`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data)) {
            setSales(response.data);
          
            // Calculate total amount manually
            const calculatedTotal = response.data.reduce((sum, sale) => {
              const finalAmount = sale.product?.price * sale.quantity * (1 - (sale.product?.discountPercentage || 0) / 100);
              return sum + (finalAmount || 0);
            }, 0);
          
            setTotalAmount(calculatedTotal);
          } else {
            setSales([]);
            setTotalAmount(0);
          }
      } catch (error) {
        console.error("Error fetching sales:", error.response?.data || error.message);
        setError("Failed to load sales data. Please try again.");
        setSales([]);
      } finally {
        setLoading(false);
      }
    };

    if (salesmanId) {
      fetchSales();
    }
  }, [salesmanId]);

  if (loading) {
    return <p className="text-center text-lg font-semibold">Loading sales data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 font-semibold">{error}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Details</h2>

      {sales.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Customer Name</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Place</th>
          <th className="border p-2">Phone</th>
          <th className="border p-2">Product</th>
          <th className="border p-2">Price</th>
          <th className="border p-2">Discount %</th>
          <th className="border p-2">Quantity</th>
          <th className="border p-2">Final Amount</th>
          <th className="border p-2">Date</th>
          <th className="border p-2">Time</th>
        </tr>
      </thead>
      <tbody>
        {sales.map((sale) => {
          const saleDate = new Date(sale.createdAt);
          const formattedDate = saleDate.toLocaleDateString();
          const formattedTime = saleDate.toLocaleTimeString();
          const finalAmount = sale.product?.price * sale.quantity * (1 - (sale.product?.discountPercentage || 0) / 100);

          return (
            <tr key={sale._id} className="hover:bg-gray-50">
              <td className="border p-2">{sale.customer?.name || "N/A"}</td>
              <td className="border p-2">{sale.customer?.email || "N/A"}</td>
              <td className="border p-2">{sale.customer?.place || "N/A"}</td>
              <td className="border p-2">{sale.customer?.phonenumber || "N/A"}</td>
              <td className="border p-2">{sale.product?.name || "N/A"}</td>
              <td className="border p-2">${sale.product?.price?.toFixed(2) || "0.00"}</td>
              <td className="border p-2">{sale.product?.discountPercentage || 0}%</td>
              <td className="border p-2">{sale.quantity}</td>
              <td className="border p-2">${finalAmount.toFixed(2)}</td>
              <td className="border p-2">{formattedDate}</td>
              <td className="border p-2">{formattedTime}</td>
            </tr>
          );
        })}
      </tbody>
    </table>

    <div className="mt-4 text-xl font-bold text-green-700">
      Total Sales Amount: ${totalAmount.toFixed(2)}
    </div>
  </div>
) : (
  <p className="text-center text-lg font-semibold text-red-600">
    No sales found. Please add sales.
  </p>
)}


      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => navigate("/adminboard")}
      >
        Go Back
      </button>
    </div>
  );
};

export default SalesDetails;