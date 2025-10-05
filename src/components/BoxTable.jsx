import React, { useState } from "react";
import {
  List,
  Package,
  Search,
  Trash2,
  SortAsc,
  SortDesc,
  Download,
  RefreshCw
} from "lucide-react";
import { useShipping } from "../context/ShippingContext";
import ShippingModel from "../models/ShippingModel";

const BoxTable = () => {
  const { boxes, setCurrentView, deleteBox } = useShipping();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedCountry, setSelectedCountry] = useState("");

  const filteredBoxes = boxes.filter((box) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      box.receiverName.toLowerCase().includes(searchLower) ||
      box.destinationCountry.toLowerCase().includes(searchLower);

    const matchesCountry =
      selectedCountry === "" || box.destinationCountry === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  const sortedBoxes = [...filteredBoxes].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === "weight") {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (sortConfig.key === "cost") {
      aValue = ShippingModel.calculateShippingCost(
        a.weight,
        a.destinationCountry
      );
      bValue = ShippingModel.calculateShippingCost(
        b.weight,
        b.destinationCountry
      );
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === "asc" ? (
      <SortAsc className="h-4 w-4 inline ml-1" />
    ) : (
      <SortDesc className="h-4 w-4 inline ml-1" />
    );
  };

  const handleDelete = async (id, receiverName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the box for "${receiverName}"?`
      )
    ) {
      const result = await deleteBox(id);
      if (result.success) {
        console.log("Box deleted successfully");
      }
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Receiver Name",
      "Weight (kg)",
      "Box Color",
      "Destination Country",
      "Shipping Cost (INR)"
    ];

    // CSV rows
    const rows = boxes.map((box) => {
      const cost = ShippingModel.calculateShippingCost(
        box.weight,
        box.destinationCountry
      );
      return [
        box.receiverName,
        box.weight,
        box.boxColor,
        box.destinationCountry,
        cost.toFixed(2)
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `shipping_boxes_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCountry("");
    setSortConfig({ key: null, direction: "asc" });
  };

  const totalWeight = boxes.reduce((sum, box) => sum + box.weight, 0);
  const totalCost = boxes.reduce((sum, box) => {
    return (
      sum +
      ShippingModel.calculateShippingCost(box.weight, box.destinationCountry)
    );
  }, 0);
  const averageWeight = boxes.length > 0 ? totalWeight / boxes.length : 0;
  const countryStats = boxes.reduce((stats, box) => {
    if (!stats[box.destinationCountry]) {
      stats[box.destinationCountry] = { count: 0, weight: 0, cost: 0 };
    }
    stats[box.destinationCountry].count += 1;
    stats[box.destinationCountry].weight += box.weight;
    stats[box.destinationCountry].cost += ShippingModel.calculateShippingCost(
      box.weight,
      box.destinationCountry
    );
    return stats;
  }, {});

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 fade-in">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
              <List className="mr-3 h-8 w-8 text-blue-600" />
              Shipping Boxes ({boxes.length})
            </h2>

            {boxes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </div>

          {boxes.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by receiver name or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {ShippingModel.getCountries().map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          )}

          {boxes.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                  Total Boxes
                </div>
                <div className="text-2xl font-bold text-blue-700 mt-1">
                  {boxes.length}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-xs text-green-600 font-medium uppercase tracking-wide">
                  Total Weight
                </div>
                <div className="text-2xl font-bold text-green-700 mt-1">
                  {totalWeight.toFixed(2)} kg
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                  Average Weight
                </div>
                <div className="text-2xl font-bold text-purple-700 mt-1">
                  {averageWeight.toFixed(2)} kg
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-xs text-orange-600 font-medium uppercase tracking-wide">
                  Total Cost
                </div>
                <div className="text-2xl font-bold text-orange-700 mt-1">
                  {ShippingModel.formatPrice(totalCost)}
                </div>
              </div>
            </div>
          )}

          {boxes.length > 0 && Object.keys(countryStats).length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Country-wise Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(countryStats).map(([country, stats]) => (
                  <div
                    key={country}
                    className="bg-gray-50 p-3 rounded border border-gray-200"
                  >
                    <div className="font-medium text-gray-800 text-sm">
                      {country}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {stats.count} boxes • {stats.weight.toFixed(2)} kg
                    </div>
                    <div className="text-xs font-semibold text-green-600 mt-1">
                      {ShippingModel.formatPrice(stats.cost)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {boxes.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Package className="h-20 w-20 mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-medium">No boxes added yet</p>
            <p className="text-sm mt-2 mb-6 text-gray-400">
              Start by adding your first shipping box
            </p>
            <button
              onClick={() => setCurrentView("form")}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <Package className="h-5 w-5 mr-2" />
              Add Your First Box
            </button>
          </div>
        ) : filteredBoxes.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No boxes found</p>
            <p className="text-sm mt-2 mb-4 text-gray-400">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => requestSort("receiverName")}
                    >
                      <div className="flex items-center">
                        Receiver Name
                        {getSortIcon("receiverName")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => requestSort("weight")}
                    >
                      <div className="flex items-center">
                        Weight (kg)
                        {getSortIcon("weight")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Box Color
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => requestSort("destinationCountry")}
                    >
                      <div className="flex items-center">
                        Destination
                        {getSortIcon("destinationCountry")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => requestSort("cost")}
                    >
                      <div className="flex items-center">
                        Shipping Cost
                        {getSortIcon("cost")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBoxes.map((box, idx) => {
                    const cost = ShippingModel.calculateShippingCost(
                      box.weight,
                      box.destinationCountry
                    );
                    const colorHex = ShippingModel.rgbToHex(box.boxColor);

                    return (
                      <tr
                        key={box.id || idx}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {box.receiverName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 font-medium">
                            {box.weight} kg
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-14 h-14 rounded-lg border-2 border-gray-300 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                              style={{ backgroundColor: colorHex }}
                              title={box.boxColor}
                            />
                            <span className="text-xs text-gray-500 font-mono">
                              {box.boxColor}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">
                              {box.destinationCountry}
                            </span>
                            <span className="text-xs text-gray-500">
                              {ShippingModel.formatPrice(
                                ShippingModel.getShippingRate(
                                  box.destinationCountry
                                )
                              )}
                              /kg
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-600">
                            {ShippingModel.formatPrice(cost)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() =>
                              handleDelete(box.id, box.receiverName)
                            }
                            className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="Delete box"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-200">
              {sortedBoxes.map((box, idx) => {
                const cost = ShippingModel.calculateShippingCost(
                  box.weight,
                  box.destinationCountry
                );
                const colorHex = ShippingModel.rgbToHex(box.boxColor);

                return (
                  <div
                    key={box.id || idx}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {box.receiverName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {box.destinationCountry}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(box.id, box.receiverName)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 uppercase">
                          Weight
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {box.weight} kg
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase">
                          Shipping Cost
                        </div>
                        <div className="text-sm font-bold text-green-600">
                          {ShippingModel.formatPrice(cost)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-500">Box Color:</div>
                      <div
                        className="w-10 h-10 rounded border-2 border-gray-300"
                        style={{ backgroundColor: colorHex }}
                      />
                      <span className="text-xs text-gray-500 font-mono">
                        {box.boxColor}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold">{filteredBoxes.length}</span>{" "}
                  of <span className="font-semibold">{boxes.length}</span> boxes
                </p>
                <button
                  onClick={() => setCurrentView("form")}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Add New Box
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BoxTable;
