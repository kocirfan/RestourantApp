const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

// Comment Schema
const commentSchema = new Schema({
    comment_id: Schema.Types.ObjectId,
    text: String,
    rating: Number,
  });
  
  // Address Schema
  const addressSchema = new Schema({
    // Address details schema
  });
  
  // Item Schema
  const itemSchema = new Schema({
    item_id: Schema.Types.ObjectId,
    quantity: Number,
  });
  
  // Order Schema
  const orderSchema = new Schema({
    order_id: Schema.Types.ObjectId,
    date: Date,
    items: [itemSchema],
    address: addressSchema,
    comments: [commentSchema],
  });
  
  // User Schema
  const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    age: Number,
    gender: String,
    profileImage: String,
    orders: [orderSchema],
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;