const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

// Restoran türleri şeması
const restaurantTypeSchema = new mongoose.Schema({
    name: String,
    // Diğer detaylar
  });
  
  // Adres şeması
  const addressSchema = new mongoose.Schema({
    city: String,
    district: String,
    street: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number]
      }
    }
  });
  
  // Şube şeması
  const branchSchema = new mongoose.Schema({
    name: String,
    address: addressSchema,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    }
  });
  
  // Menü şeması
  const menuSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String
  });
  
  // Restoran şeması
  const restaurantSchema = new mongoose.Schema({
    name: String,
    description: String,
    logo: String,
    address: addressSchema,
    branches: [branchSchema],
    menu: [menuSchema],
    restaurantTypes: [restaurantTypeSchema] // Restaurant türleri içeren alt belge
  });
  
  // Model oluşturma
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  
  module.exports = Restaurant;