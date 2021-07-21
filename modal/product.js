const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true, unique: true ,get:(image)=>{
            return `${process.env.app_url}/${image}`;
    } }


},{toJSON:{getters:true}});

module.exports = mongoose.model("product", productSchema);