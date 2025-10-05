import React, { createContext, useContext, useState, useCallback } from "react";
import ShippingService from "../services/ShippingService";

const ShippingContext = createContext(undefined);

export const useShipping = () => {
  const context = useContext(ShippingContext);
  if (!context) {
    throw new Error("useShipping must be used within ShippingProvider");
  }
  return context;
};

export const ShippingProvider = ({ children }) => {
  const [boxes, setBoxes] = useState([]);
  const [currentView, setCurrentView] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addBox = useCallback(async (box) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ShippingService.saveBox(box);

      if (response.success) {
        setBoxes((prev) => [...prev, response.data]);
        return { success: true, message: response.message };
      }

      return { success: false, error: "Failed to save box" };
    } catch (err) {
      setError(err.message || "An error occurred while saving the box");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getBoxes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ShippingService.getBoxes(boxes);

      if (response.success) {
        return { success: true, data: response.data };
      }

      return { success: false, error: "Failed to fetch boxes" };
    } catch (err) {
      setError(err.message || "An error occurred while fetching boxes");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [boxes]);

  const deleteBox = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ShippingService.deleteBox(id);

      if (response.success) {
        setBoxes((prev) => prev.filter((box) => box.id !== id));
        return { success: true, message: response.message };
      }

      return { success: false, error: "Failed to delete box" };
    } catch (err) {
      setError(err.message || "An error occurred while deleting the box");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearBoxes = useCallback(() => {
    setBoxes([]);
  }, []);

  const switchView = useCallback((view) => {
    setCurrentView(view);
  }, []);

  const value = {
    boxes,
    currentView,
    loading,
    error,

    addBox,
    getBoxes,
    deleteBox,
    clearBoxes,
    setCurrentView: switchView
  };

  return (
    <ShippingContext.Provider value={value}>
      {children}
    </ShippingContext.Provider>
  );
};

export default ShippingContext;
