import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import stance from "../interceptors/interceptors";

const Checkout = () => {
  const [sales, setSales] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  // Assuming the logged-in salesman is stored in localStorage
  const salesmanId = localStorage.getItem("salesmanId"); 
    console.log("Salesman ID:", salesmanId);



    useEffect(() => {
        const fetchSales = async () => {
          try {
            const token = localStorage.getItem("token"); // Get token from localStorage
            if (!token) {
              console.error("No token found, authentication required.");
              return;
            }
      
            const response = await stance.get(
                `/api/sales/salesform/${salesmanId}`,
                {
                headers: {
                  Authorization: `Bearer ${token}`, // Send token in the request header
                },
              }
            );
      
            setSales(response.data.sales);
            setTotalAmount(response.data.totalAmount);
          } catch (error) {
            console.error("Error fetching sales:", error);
          }
        };
      
        if (salesmanId) {
          fetchSales();
        }
      }, [salesmanId]);
      ;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout - Sales Summary</h2>

      {sales.length > 0 ? (
        <div>
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
                <th className="border p-2">Quantity</th> {/* Added Quantity */}
                <th className="border p-2">Final Amount</th>
                <th className="border p-2">Salesman</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => {
                const saleDate = new Date(sale.createdAt);
                const formattedDate = saleDate.toLocaleDateString();
                const formattedTime = saleDate.toLocaleTimeString();
                const finalAmount = sale.product.price * sale.quantity * (1 - sale.product.discountPercentage / 100);

                return (
                  <tr key={sale._id}>
                    <td className="border p-2">{sale.customer.name}</td>
                    <td className="border p-2">{sale.customer.email}</td>
                    <td className="border p-2">{sale.customer.place}</td>
                    <td className="border p-2">{sale.customer.phonenumber}</td>
                    <td className="border p-2">{sale.product.name}</td>
                    <td className="border p-2">{sale.product.price.toFixed(2)}</td>
                    <td className="border p-2">{sale.product.discountPercentage}%</td>
                    <td className="border p-2">{sale.quantity}</td> {/* Display Quantity */}
                    <td className="border p-2">{finalAmount.toFixed(2)}</td>
                    <td className="border p-2">{sale.salesman.name}</td>
                    <td className="border p-2">{formattedDate}</td>
                    <td className="border p-2">{formattedTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4 text-xl font-bold">
            Total Sales Amount: ${totalAmount.toFixed(2)}
          </div>
        </div>
      ) : (
        <p>No sales found for this salesman.</p>
      )}

      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => navigate("/salesboard")}
      >
        Go Back
      </button>
    </div>
  );
};

export default Checkout;
