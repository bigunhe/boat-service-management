import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      if (data.success) {
        const foundProduct = data.data.find(p => p._id === id);
        setProduct(foundProduct || null);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (selectedQty <= 0 || selectedQty > product.quantity) {
      alert(`Please select a quantity between 1 and ${product.quantity}`);
      return;
    }

    //Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    //Check if product already exists in cart
    const existingIndex = cart.findIndex((p) => p._id === product._id);
    if (existingIndex >= 0) {
      cart[existingIndex].selectedQty += selectedQty;
    } else {
      cart.push({ ...product, selectedQty });
    }

    //Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    //Show success message
    alert(`${selectedQty} x ${product.name} added to your cart.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/spare-parts')}
          className="mb-6 text-blue-600 hover:text-blue-800"
        >
          ← Back to Spare Parts
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div>
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-gray-500">No Image Available</span>
                )}
              </div>
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg mb-2"><strong>Part No:</strong> {product.partNumber}</p>
              <p className="text-gray-600 text-lg mb-2"><strong>Company:</strong> {product.company}</p>
              <p className="text-gray-600 text-lg mb-2"><strong>Available:</strong> {product.quantity}</p>
              <p className="text-gray-600 text-lg mb-4"><strong>Category:</strong> {product.category || "Uncategorized"}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-blue-600">Rs. {product.price.toLocaleString()}</span>
                <span className="ml-4 text-green-600">In Stock ({product.quantity} available)</span>
              </div>

              {/* Quantity and Actions */}
              <div className="border-t pt-6">
                <div className="flex items-center mb-4">
                  <label className="mr-4 font-medium">Select Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={selectedQty}
                    onChange={(e) => setSelectedQty(Number(e.target.value))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300"
                    disabled={product.quantity === 0}
                  >
                    {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button
                    onClick={() => navigate('/404')}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors duration-300"
                    disabled={product.quantity === 0}
                  >
                    Buy Now (Coming Soon)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
