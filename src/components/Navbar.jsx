import React from "react";
import { Menu, Package, List } from "lucide-react";
import { useShipping } from "../context/ShippingContext";

const Navbar = () => {
  const { currentView, setCurrentView, boxes } = useShipping();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Package className="h-8 w-8 mr-2" />
            <div className="flex flex-col">
              <span className="font-bold text-xl hidden sm:block">
                Shipping Calculator
              </span>
              <span className="text-xs text-blue-200 hidden md:block">
                India to Worldwide
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView("form")}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                currentView === "form"
                  ? "bg-white text-blue-600 font-semibold shadow-md"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
              aria-label="Add Box View"
            >
              <Menu className="h-5 w-5" />
              <span className="hidden sm:inline">Add Box</span>
            </button>

            <button
              onClick={() => setCurrentView("table")}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 relative ${
                currentView === "table"
                  ? "bg-white text-blue-600 font-semibold shadow-md"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
              aria-label="View Boxes"
            >
              <List className="h-5 w-5" />
              <span className="hidden sm:inline">View Boxes</span>
              {boxes.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {boxes.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
