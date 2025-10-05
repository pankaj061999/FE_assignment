const ShippingModel = {
  countries: {
    Sweden: 7.35,
    China: 11.53,
    Brazil: 15.63,
    Australia: 50.09
  },

  calculateShippingCost(weight, country) {
    const multiplier = this.countries[country];
    if (!multiplier) {
      throw new Error(`Invalid country: ${country}`);
    }
    return weight * multiplier;
  },

  validateBox(box) {
    const errors = {};

    if (!box.receiverName || box.receiverName.trim() === "") {
      errors.receiverName = "Receiver name is required";
    } else if (box.receiverName.length > 100) {
      errors.receiverName = "Receiver name must be less than 100 characters";
    }

    if (box.weight === "" || box.weight === null || box.weight === undefined) {
      errors.weight = "Weight is required";
    } else if (box.weight < 0) {
      errors.weight = "Weight cannot be negative";
    } else if (box.weight === 0) {
      errors.weight = "Weight must be greater than 0";
    } else if (box.weight > 10000) {
      errors.weight = "Weight must be less than 10000 kg";
    }

    if (!box.boxColor || box.boxColor.trim() === "") {
      errors.boxColor = "Box color is required";
    }

    if (!box.destinationCountry) {
      errors.destinationCountry = "Destination country is required";
    } else if (!this.countries[box.destinationCountry]) {
      errors.destinationCountry = "Invalid destination country";
    }

    return errors;
  },

  rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    if (!result || result.length !== 3) return rgb;

    const r = parseInt(result[0]);
    const g = parseInt(result[1]);
    const b = parseInt(result[2]);

    if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0) {
      return "#ffffff";
    }

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )})`
      : "rgb(255, 255, 255)";
  },

  formatPrice(amount) {
    return `₹${amount.toFixed(2)}`;
  },

  getCountries() {
    return Object.keys(this.countries);
  },

  getShippingRate(country) {
    return this.countries[country] || 0;
  }
};

export default ShippingModel;
