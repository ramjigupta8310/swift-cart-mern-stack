import mongoose from 'mongoose';

const categoryItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  imgSrc: { type: String, required: true },
  offer: { type: String, required: true }
}, { timestamps: true }); 

const CategoryItem = mongoose.model('CategoryItem', categoryItemSchema);

export default CategoryItem;
