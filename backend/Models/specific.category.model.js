import mongoose from 'mongoose';

// Common product schema for all collections
const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imgSrc: { type: String, required: true },
  imgSrc2: { type: String },  // Optional fields for extra images
  imgSrc3: { type: String },
  imgSrc4: { type: String },
  imgSrc5: { type: String },
  imgSrc6: { type: String },
  productLink: { type: String, required: true },
  price: { type: Number, required: true },
  realPrice: { type: Number, required: true },
  color: { type: String },
  sizes: [{ type: String}],
}, {
  timestamps: true  
});

// Defining models for each collection
const EthnicWear = mongoose.model('EthnicWear', productSchema, 'ethnic-wear');
const SleepWear = mongoose.model('SleepWear', productSchema, 'sleep-wear');
const HomeDecor = mongoose.model('HomeDecor', productSchema, 'home-decor');
const WorkWear = mongoose.model('WorkWear', productSchema, 'work-wear');
const KidsWear = mongoose.model('KidsWear', productSchema, 'kids-wear');
const SportsShoes = mongoose.model('SportsShoes', productSchema, 'sports-shoes');
const OfficeWear = mongoose.model('OfficeWear', productSchema, 'office-wear');
const MensWear = mongoose.model('MensWear', productSchema, 'mens-wear');
const CasualStyles = mongoose.model('CasualStyles', productSchema, 'casual-styles');
const WesternWear = mongoose.model('WesternWear', productSchema, 'western-wear');
const WfhWear = mongoose.model('WfhWear', productSchema, 'wfh-wear');
const WomensFootwear = mongoose.model('WomensFootwear', productSchema, 'womens-footwear');


export { EthnicWear, SleepWear, HomeDecor, WorkWear, KidsWear, SportsShoes, OfficeWear, MensWear, CasualStyles, WesternWear, WfhWear, WomensFootwear };

