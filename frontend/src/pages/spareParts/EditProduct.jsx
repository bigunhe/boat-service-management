import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    partNumber: "",
    company: "",
    category: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const categories = ["PowerHead", "Electronical", "Gearbox", "BracketUnit", "FuelSystem"];

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
        if (foundProduct) {
          setProduct({
            name: foundProduct.name || "",
            price: foundProduct.price || "",
            image: foundProduct.image || "",
            partNumber: foundProduct.partNumber || "",
            company: foundProduct.company || "",
            category: foundProduct.category || "",
            quantity: foundProduct.quantity || "",
          });
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleUpdateProduct = async () => {
    // Trim values
    const name = product.name.trim();
    const partNumber = product.partNumber.trim();
    const company = product.company.trim();
    const image = product.image.trim();
    const quantity = parseInt(product.quantity);
    const price = parseFloat(product.price);

    // Basic validation
    if (!name || name.length < 3) {
      alert("Product name must be at least 3 characters long");
      return;
    }

    if (!partNumber) {
      alert("Part number is required");
      return;
    }

    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price greater than 0");
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter how many available in your stock");
      return;
    }

    if (!company) {
      alert("Company name is required");
      return;
    }

    if (!product.category) {
      alert("Please select a category");
      return;
    }

    // Image URL validation (optional but must be valid if provided)
    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp))$/i;
    if (image && !urlRegex.test(image)) {
      alert("Image URL must be a valid link ending with .jpg, .png, .jpeg or .webp");
      return;
    }

    setLoading(true);

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          name,
          partNumber,
          company,
          image,
          price,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Product updated successfully");
        navigate('/inventory');
      } else {
        alert("Error updating product: " + data.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Edit Product
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Part Number
              </label>
              <input
                type="text"
                name="partNumber"
                value={product.partNumber}
                onChange={handleInputChange}
                placeholder="Enter part number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (Rs.)
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={product.image}
                onChange={handleInputChange}
                placeholder="Enter image URL (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={product.company}
                onChange={handleInputChange}
                placeholder="Enter company name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleInputChange}
                placeholder="Enter available quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleUpdateProduct}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
              <button
                onClick={() => navigate('/inventory')}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
