import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    partNumber: "",
    company: "",
    category: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);

  const categories = ["PowerHead", "Electronical", "Gearbox", "BracketUnit", "FuelSystem"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleAddProduct = async () => {
    // Trim values
    const name = newProduct.name.trim();
    const partNumber = newProduct.partNumber.trim();
    const company = newProduct.company.trim();
    const image = newProduct.image.trim();
    const quantity = parseInt(newProduct.quantity);
    const price = parseFloat(newProduct.price);

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

    if (!newProduct.category) {
      alert("Please select a category");
      return;
    }

    // Image URL validation (optional but must be valid if provided)
    const urlRegex = /^https?:\/\/.+/i;
    if (image && !urlRegex.test(image)) {
      alert("Image URL must be a valid HTTP/HTTPS link");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
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
        alert("Product created successfully");
        navigate('/inventory');
      } else {
        alert("Error creating product: " + data.message);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Create New Product
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
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
                value={newProduct.partNumber}
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
                value={newProduct.price}
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
                value={newProduct.image}
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
                value={newProduct.company}
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
                value={newProduct.category}
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
                value={newProduct.quantity}
                onChange={handleInputChange}
                placeholder="Enter available quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddProduct}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Product"}
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

export default CreateProduct;
