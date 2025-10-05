import React, { useState } from "react";
import { Package, Save, AlertCircle, CheckCircle } from "lucide-react";
import { useShipping } from "../context/ShippingContext";
import ShippingModel from "../models/ShippingModel";

const BoxForm = () => {
  const { addBox, setCurrentView, loading } = useShipping();

  const [formData, setFormData] = useState({
    receiverName: "",
    weight: "",
    boxColor: "#ffffff",
    destinationCountry: ""
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "weight") {
      const numValue = parseFloat(value);
      if (value !== "" && numValue < 0) {
        setErrors((prev) => ({
          ...prev,
          weight: "Negative values are not permitted. Weight defaulted to 0."
        }));
        setFormData((prev) => ({ ...prev, [name]: "0" }));

        setTimeout(() => {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.weight;
            return newErrors;
          });
        }, 3000);
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    const boxData = {
      receiverName: formData.receiverName.trim(),
      weight: parseFloat(formData.weight) || 0,
      boxColor: ShippingModel.hexToRgb(formData.boxColor),
      destinationCountry: formData.destinationCountry
    };

    const validationErrors = ShippingModel.validateBox(boxData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await addBox(boxData);

    if (result.success) {
      setShowSuccess(true);
      setFormData({
        receiverName: "",
        weight: "",
        boxColor: "#ffffff",
        destinationCountry: ""
      });
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } else {
      setErrors({ submit: result.error || "Failed to save box" });
    }
  };

  const getShippingPreview = () => {
    if (formData.weight && formData.destinationCountry) {
      const cost = ShippingModel.calculateShippingCost(
        parseFloat(formData.weight),
        formData.destinationCountry
      );
      return ShippingModel.formatPrice(cost);
    }
    return null;
  };

  const shippingPreview = getShippingPreview();

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 fade-in">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Package className="mr-3 h-8 w-8 text-blue-600" />
          Add New Box
        </h2>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center success-message">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>Box added successfully!</span>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receiver Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.receiverName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter receiver name"
              maxLength={100}
            />
            {errors.receiverName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.receiverName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="10000"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.weight ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter weight in kilograms"
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.weight}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Maximum weight: 10,000 kg
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Box Color <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                name="boxColor"
                value={formData.boxColor}
                onChange={handleChange}
                className="h-12 w-20 rounded cursor-pointer border-2 border-gray-300 transition-transform hover:scale-105"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={ShippingModel.hexToRgb(formData.boxColor)}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  placeholder="RGB format"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Color in RGB format
                </p>
              </div>
            </div>
            {errors.boxColor && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.boxColor}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Country <span className="text-red-500">*</span>
            </label>
            <select
              name="destinationCountry"
              value={formData.destinationCountry}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.destinationCountry ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a country</option>
              {ShippingModel.getCountries().map((country) => (
                <option key={country} value={country}>
                  {country} (
                  {ShippingModel.formatPrice(
                    ShippingModel.getShippingRate(country)
                  )}
                  /kg)
                </option>
              ))}
            </select>
            {errors.destinationCountry && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.destinationCountry}
              </p>
            )}
          </div>

          {shippingPreview && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Estimated Shipping Cost:
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {shippingPreview}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Save className="h-5 w-5" />
            <span>{loading ? "Saving..." : "Save Box"}</span>
          </button>

          <div className="text-center">
            <button
              onClick={() => setCurrentView("table")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
            >
              View all boxes →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxForm;
