const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  carName: { type: String, required: true },
  manufacturingYear: { type: Number, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },  // URL to the car's image
  websiteUrl: { type: String, required: true },  // URL to the car's detailed page or external link
  description: { type: String, required: true },  // Description of the car
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
