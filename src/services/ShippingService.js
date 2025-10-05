const ShippingService = {
  async saveBox(box) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!box.receiverName || !box.destinationCountry) {
            reject({
              success: false,
              error: "Invalid box data",
              message: "Required fields are missing"
            });
            return;
          }

          resolve({
            success: true,
            data: {
              ...box,
              id: Date.now(),
              createdAt: new Date().toISOString()
            },
            message: "Box saved successfully"
          });
        } catch (error) {
          reject({
            success: false,
            error: error.message,
            message: "Failed to save box"
          });
        }
      }, 300);
    });
  },
  async getBoxes(boxes) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: boxes,
          count: boxes.length,
          message: "Boxes retrieved successfully"
        });
      }, 200);
    });
  },

  async deleteBox(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { id },
          message: "Box deleted successfully"
        });
      }, 200);
    });
  },

  async updateBox(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { id, ...updates },
          message: "Box updated successfully"
        });
      }, 300);
    });
  }
};

export default ShippingService;
