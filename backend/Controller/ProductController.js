import { EthnicWear, SleepWear, HomeDecor, WorkWear, KidsWear, SportsShoes, OfficeWear, MensWear, CasualStyles, WesternWear, WfhWear, WomensFootwear } from '../Models/specific.category.model.js';
import AllCategoryModel from "../Models/allcategory.model.js"


// add product by category
const getProductModel = (category) => {
  switch (category) {
    case 'ethnic-wear':
      return EthnicWear;
    case 'sleep-wear':
      return SleepWear;
    case 'home-decor':
      return HomeDecor;
    case 'work-wear':
      return WorkWear;
    case 'kids-wear':
      return KidsWear;
    case 'sports-shoes':
      return SportsShoes;
    case 'office-wear':
      return OfficeWear;
    case 'mens-wear':
      return MensWear;
    case 'casual-styles':
      return CasualStyles;
    case 'western-wear':
      return WesternWear;
    case 'wfh-wear':
      return WfhWear;
    case 'womens-footwear':
      return WomensFootwear;
    default:
      throw new Error('Invalid category');
  }
};

export const addProductByCategory = async (req, res) => {
  const { category } = req.params; // Dynamic category from URL
  const products = req.body; // Data sent in request body

  try {
    // Get the model based on the category
    const ProductModel = getProductModel(category);

    // Check if data is an array (bulk insert) or a single object
    if (Array.isArray(products)) {
      // Bulk insert
      const insertedProducts = await ProductModel.insertMany(products);
      res.status(201).json({
        message: `${insertedProducts.length} products added to ${category}`,
        products: insertedProducts
      });
    } else {
      // Single product insert
      const newProduct = new ProductModel(products);
      const savedProduct = await newProduct.save();
      res.status(201).json({
        message: `Product added to ${category}`,
        product: savedProduct
      });
    }
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// add all categories
export const addAllCategory = async (req, res) => {
  // const { category } = req.params; // Dynamic category from URL
  const products = req.body; // Data sent in request body

  try {
    // Get the model based on the category
    // const ProductModel = getProductModel(category);

    // Check if data is an array (bulk insert) or a single object
    if (Array.isArray(products)) {
      // Bulk insert
      const insertedProducts = await AllCategoryModel.insertMany(products);
      res.status(201).json({
        message: `${insertedProducts.length} categories added`,
        products: insertedProducts
      });
    } else {
      // Single product insert
      const newProduct = new AllCategoryModel(products);
      const savedProduct = await newProduct.save();
      res.status(201).json({
        message: `Product added`,
        product: savedProduct
      });
    }
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await AllCategoryModel.find(); // Fetch all documents from the collection
    const totalCount = await AllCategoryModel.countDocuments(); // Count the total number of documents in the collection

    res.status(200).json({
      message: `${totalCount} documents found in the collection`, // Custom message
      totalCount, // Include the total count in the response
      categories, // Include the fetched categories
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};

// get products by specific category
const categoryModels = {
  "ethnic-wear": EthnicWear,
  "sleep-wear": SleepWear,
  "home-decor": HomeDecor,
  "work-wear": WorkWear,
  "kids-wear": KidsWear,
  "sports-shoes": SportsShoes,
  "office-wear": OfficeWear,
  "mens-wear": MensWear,
  "casual-styles": CasualStyles,
  "western-wear": WesternWear,
  "wfh-wear": WfhWear,
  "womens-footwear": WomensFootwear
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params; // Extract category from URL
    const Model = categoryModels[category]; // Get the model corresponding to the category

    if (!Model) {
      return res.status(404).json({ message: `Category ${category} not found` });
    }

    const products = await Model.find(); // Fetch all products for that category
    const totalCount = await Model.countDocuments(); // Count the total number of products in that category

    res.status(200).json({
      message: `${totalCount} products found in the ${category} category`,
      totalCount,
      products
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};


